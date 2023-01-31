import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortOrder } from 'src/common/entities/core.entity';
import { createError } from 'src/common/utils/createError';
import { HoKhau } from 'src/hokhau/entity/hokhau.entity';
import { TamTru } from 'src/hokhau/entity/tamtru.entity';
import { User } from 'src/user/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import {
  AddDongGopInput,
  AddDongGopOutput,
  EditDongGopInput,
  EditDongGopOutput,
  xemDanhSachDongGopChoNguoiDungOutput,
  xemDanhSachDongGopChoNguoiQuanLiInput,
  xemDanhSachDongGopChoNguoiQuanLiOutput,
} from '../dtos/donggop.dto';

import { DongGop } from '../entities/donggop.entity';
import { KhoanPhi, LoaiPhi } from '../entities/khoanphi.entity';

@Injectable()
export class DongGopService {
  constructor(
    @InjectRepository(DongGop)
    private readonly donggopRepo: Repository<DongGop>,
    @InjectRepository(TamTru)
    private readonly tamtruRepo: Repository<TamTru>,
    @InjectRepository(HoKhau)
    private readonly hokhauRepo: Repository<HoKhau>,
    @InjectRepository(KhoanPhi)
    private readonly khoanphiRepo: Repository<KhoanPhi>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  //    thêm đóng góp
  async addDongGop(input: AddDongGopInput): Promise<AddDongGopOutput> {
    try {
      const { KhoanPhiId, soTienDongGop, hoKhauId, nguoiTamTruId } = input;

      //kiểm tra tồn tại cả hai ID:hoKhauId và nguoiTamTruId
      if (hoKhauId != 0 && nguoiTamTruId != 0) {
        return createError(
          'Input',
          'Không thể tồn tại đồng thời cả người tạm trú và hộ khẩu',
        );
      }

      // kiểm tra xem hộ khẩu hoặc người tạm trú này có tồn tại hay không
      const nguoitamtru = await this.tamtruRepo.findOne({
        where: {
          id: nguoiTamTruId,
        },
        relations: {
          nguoiTamTru: true,
        },
      });
      const hokhau = await this.hokhauRepo.findOne({
        where: {
          id: hoKhauId,
        },
        
      });
      const khoanphi = await this.khoanphiRepo.findOne({
        where: {
          id: KhoanPhiId,
        },
      });
      if (khoanphi.ngayHetHan < new Date())
        return createError('Input', 'Hết thời hạn nộp đóng góp');
      if (!khoanphi) return createError('Input', 'Khoản phí này không tồn tại');
      if (!hokhau && !nguoitamtru)
        return createError('Input', 'Người tạm trú hoặc hộ khẩu không tồn tại');
      if (hokhau) {
        //kiểm tra xem khoản đóng góp của hộ này đã được thêm vào trước đó chưa
        const donggop = await this.donggopRepo.find({
          where: {
            hoKhau: {
              id: hoKhauId,
            },
          },
          relations: {
            hoKhau: true,
            khoanPhi: true,
          },
        });
        donggop.forEach((dg, index) => {
          if (dg.khoanPhi.id != KhoanPhiId) {
            delete donggop[index];
          }
        });
        console.log(donggop);
        if (!donggop)
          return createError(
            'Input',
            'Khoản đóng góp của người này đã được thêm vào',
          );
        // thêm đóng góp vào database
        await this.donggopRepo.save(
          this.donggopRepo.create({
            khoanPhi: khoanphi,
            hoKhau: hokhau,
            ngayNop: new Date(),
            soTienDongGop,
            trangThai: true,
          }),
        );
      }
      if (nguoitamtru) {
        //kiểm tra xem khoản đóng góp của người này này đã được thêm vào trước đó chưa
        const donggop = await this.donggopRepo.find({
          where: {
            nguoiTamTru: {
              id: nguoiTamTruId,
            },
          },
          relations: {
            khoanPhi: true,
          },
        });
        donggop.forEach((dg, index) => {
          if (dg.khoanPhi.id != KhoanPhiId) {
            delete donggop[index];
          }
        });
        if (!donggop)
          return createError(
            'Input',
            'Khoản đóng góp của người này đã được thêm vào',
          );
        // thêm khoản đóng góp vào database
        await this.donggopRepo.save(
          this.donggopRepo.create({
            khoanPhi: khoanphi,
            nguoiTamTru: nguoitamtru,
            ngayNop: new Date(),
            soTienDongGop,
            trangThai: true,
          }),
        );
      }
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Input', 'Lỗi server,thử lại sau');
    }
  }

  async editDongGop(input: EditDongGopInput): Promise<EditDongGopOutput> {
    try {
      const { dongGopId, soTienDongGop, ngayNop } = input;

      const dongGop = await this.donggopRepo.findOne({
        where: {
          id: dongGopId,
        },
        relations: {
          khoanPhi: true,
        },
      });
      // kiểm tra xem khoản phí này đã tồn tại hay chưa
      if (!dongGop)
        return createError('Input', 'Khoản đóng góp này chưa tồn tại');
      //kiểm tra số tiền đóng góp có phù hợp hay không
      if (
        soTienDongGop != dongGop.khoanPhi.soTien &&
        dongGop.khoanPhi.loaiPhi == LoaiPhi.BatBuoc
      ) {
        return createError(
          'Input',
          'Số tiền cần đóng(VNĐ):' + dongGop.khoanPhi.soTien,
        );
      }
      if (
        soTienDongGop < dongGop.soTienDongGop &&
        dongGop.khoanPhi.loaiPhi == LoaiPhi.UngHo
      ) {
        return createError(
          'Input',
          'Số tiền tối thiểu cần đóng(VNĐ):' + dongGop.khoanPhi.soTien,
        );
      }
      if (dongGop.khoanPhi.ngayHetHan < ngayNop)
        return createError('Input', 'Đã quá hạn nộp đóng góp này');
      // chỉnh sửa lại thông tin đóng góp
      dongGop.soTienDongGop = soTienDongGop;
      dongGop.trangThai = true;
      dongGop.ngayNop = ngayNop;
      this.donggopRepo.save(dongGop);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  //xem danh sách  đóng góp dành cho quản lý
  async xemDanhSachDongGopChoNguoiQuanLi(
    input: xemDanhSachDongGopChoNguoiQuanLiInput,
  ): Promise<xemDanhSachDongGopChoNguoiQuanLiOutput> {
    try {
      const {
        paginationInput: { page, resultsPerPage },
        loaiPhi,
        tenKhoanPhi,
        trangThai,
        sohoKhau,
        // canCuocCongDan,
      } = input;
      const [dongGop, totalResults] = await this.donggopRepo.findAndCount({
        where: {
          khoanPhi: {
            tenKhoanPhi: tenKhoanPhi ? ILike(`%${tenKhoanPhi}%`) : undefined,
            loaiPhi: loaiPhi || undefined,
          },

          trangThai,
          hoKhau: {
            soHoKhau: sohoKhau ? ILike(`%${sohoKhau}%`) : undefined,
          },

          // nguoiTamTru: {
          //   canCuocCongDan: canCuocCongDan
          //     ? ILike(`%${canCuocCongDan}%`)
          //     : undefined,
          // },
        },
        relations: {
          hoKhau: true,
          nguoiTamTru: true,
        },
        skip: (page - 1) * resultsPerPage, // bỏ qua bao nhiêu bản ghi
        take: resultsPerPage, // lấy bao nhiêu bản ghi
        order: {
          updatedAt: SortOrder.DESC,
        }, // sắp xếp theo giá trị của trường cụ thể tuỳ mọi người truyền vào sao cho hợp lệ
      });

      return {
        ok: true,
        DongGop: dongGop,
        paginationOutput: {
          totalResults,
          totalPages: Math.ceil(totalResults / resultsPerPage),
        },
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  //xem danh sách  đóng góp dành cho quản lý
  async xemDanhSachDongGopChoNguoiDung(
    nguoiHienTai: User,
  ): Promise<xemDanhSachDongGopChoNguoiDungOutput> {
    try {
      const nguoiTamTru = await this.tamtruRepo.findOne({
        where: {
          nguoiTamTru: {
            id: nguoiHienTai.id,
          },
        },
      });

      if (nguoiTamTru) {
        const dongGop = await this.donggopRepo.find({
          where: {
            nguoiTamTru: {
              id: nguoiTamTru.id,
            },
          },
          relations: {
            nguoiTamTru: true,
            khoanPhi: true,
          },
        });
        return {
          ok: true,
          DongGop: dongGop,
        };
      }
      if (nguoiHienTai.hoKhauId) {
        const dongGop = await this.donggopRepo.find({
          where: {
            hoKhau: {
              id: nguoiHienTai.hoKhauId,
            },
          },
          relations: {
            khoanPhi: true,
            hoKhau: true,
          },
        });
        return {
          ok: true,
          DongGop: dongGop,
        };
      }
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
