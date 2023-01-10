import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortOrder } from 'src/common/entities/core.entity';
import { createError } from 'src/common/utils/createError';
import { HoKhau } from 'src/hokhau/entity/hokhau.entity';
import { TamTru } from 'src/hokhau/entity/tamtru.entity';
import { ILike, Repository } from 'typeorm';
import {
  AddDongGopInput,
  AddDongGopOutput,
  EditDongGopInput,
  EditDongGopOutput,
  xemDanhSachDongGopChoNguoiQuanLiInput,
  xemDanhSachDongGopChoNguoiQuanLiOutput,
} from '../dtos/donggop.dto';

import { DongGop } from '../entities/DongGop.entity';
import { KhoanPhi } from '../entities/khoanphi.entity';

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
  ) {}

  //    thêm đóng góp
  async addDongGop(input: AddDongGopInput): Promise<AddDongGopOutput> {
    try {
      const { KhoanPhiId, soTienDongGop, hoKhauId, nguoiTamTruId } = input;
      // kiểm tra xem hộ khẩu hoặc người tạm trú này có tồn tại hay không
      const nguoitamtru = await this.tamtruRepo.findOne({
        where: {
          id: nguoiTamTruId,
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
      if (!khoanphi) return createError('Input', 'Khoản phí này không tồn tại');
      if (!hokhau && !nguoitamtru)
        return createError('Input', 'Người tạm trú hoặc hộ khẩu không tồn tại');
      if (hokhau) {
        //kiểm tra xem khoản đóng góp của hộ này đã được thêm vào trước đó chưa
        const donggop = await this.donggopRepo.findOne({
          where: {
            hoKhau: {
              id: hoKhauId,
            },
            khoanPhi: {
              id: KhoanPhiId,
            },
          },
        });
        if (donggop)
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
      } else if (nguoitamtru) {
        //kiểm tra xem khoản đóng góp của người này này đã được thêm vào trước đó chưa
        const donggop = await this.donggopRepo.findOne({
          where: {
            nguoiTamTru: {
              id: nguoiTamTruId,
            },
            khoanPhi: {
              id: KhoanPhiId,
            },
          },
        });
        if (donggop)
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
      });
      if (!dongGop)
        return createError('Input', 'Khoản đóng góp này chưa tồn tại');

      // chỉnh sửa lại thông tin đóng góp
      dongGop.soTienDongGop = soTienDongGop;
      dongGop.trangThai = true;
      dongGop.ngayNop = new Date(ngayNop);
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
        canCuocCongDan,
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
          nguoiTamTru: {
            canCuocCongDan: canCuocCongDan
              ? ILike(`%${canCuocCongDan}%`)
              : undefined,
          },
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
}
