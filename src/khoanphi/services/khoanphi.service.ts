import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortOrder } from 'src/common/entities/core.entity';
import { createError } from 'src/common/utils/createError';
import { HoKhau } from 'src/hokhau/entity/hokhau.entity';
import { TamTru } from 'src/hokhau/entity/tamtru.entity';
import { TamVang } from 'src/hokhau/entity/tamvang.entity';
import { User } from 'src/user/entities/user.entity';
import { ILike, In, Not, Repository } from 'typeorm';
import {
  AddKhoanPhiInput,
  AddKhoanPhiOutput,
  xemDanhSachKhoanPhiChoNguoiQuanLiInput,
  xemDanhSachKhoanPhiChoNguoiQuanLiOutput,
  XemKhoanPhiChiTietChoQuanLiInput,
  XemKhoanPhiChiTietChoQuanLiOutput,
} from '../dtos/khoanphi.dto';
import { DongGop } from '../entities/donggop.entity';
import { KhoanPhi, LoaiPhi } from '../entities/khoanphi.entity';

@Injectable()
export class KhoanPhiService {
  constructor(
    @InjectRepository(KhoanPhi)
    private readonly khoanphiRepo: Repository<KhoanPhi>,
    @InjectRepository(HoKhau)
    private readonly hokhauRepo: Repository<HoKhau>,
    @InjectRepository(TamTru)
    private readonly tamtruRepo: Repository<TamTru>,
    @InjectRepository(TamVang)
    private readonly tamvangRepo: Repository<TamVang>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(DongGop)
    private readonly donggopRepo: Repository<DongGop>,
  ) {}

  //    thêm khoản phí
  async addKhoanPhi(
    nguoiTao: User,
    input: AddKhoanPhiInput,
  ): Promise<AddKhoanPhiOutput> {
    try {
      const {
        tenKhoanPhi,
        loaiPhi,
        soTien,
        theoHoKhau,
        ngayHetHan,
        ngayPhatDong,
      } = input;
      // kiểm tra người đó đã tồn tại trong bảng khoản phí hay chưa
      const khoanphi = await this.khoanphiRepo.findOne({
        where: {
          tenKhoanPhi: tenKhoanPhi,
        },
      });
      if (khoanphi) return createError('Input', 'Khoản phí này đã được thêm ');
      if (ngayHetHan < ngayPhatDong)
        return createError('Input', 'Ngày hết hạn đang sớm hơn ngày phát động');
      let dongGop = [];
      if (loaiPhi == LoaiPhi.BatBuoc) {
        const hokhau = await this.hokhauRepo.find({
          relations: {
            // thanhVien: true,
            soHoKhau:true,
          },
        });
        const tamtru = await this.tamtruRepo.find({
          relations: {
            nguoiTamTru:{
              canCuocCongDan:true,
            }
          },
        });
        const tamtruIdUser = tamtru.map((tt) => tt.nguoiTamTru.id);
        const tamtru2 = await this.userRepo.find({
          where: {
            id: In(tamtruIdUser),
          },
        });
        for (const hk of hokhau) {
          const tvId = hk.thanhVien.map((tv) => tv.id);
          const tamvang = await this.tamvangRepo.find({
            where: {
              nguoiTamVang: {
                id: In(tvId),
              },
              // ngayHetHan:Not(null),
            },
          });
          const thanhVienHk = await this.userRepo.find({
            where: {
              hoKhau: {
                id: hk.id,
              },
            },
            relations: {
              hoKhau: true,
            },
          });
          dongGop.push(
            this.donggopRepo.create({
              hoKhau: hk,
              soTienDongGop: soTien * (thanhVienHk.length - 0),
              trangThai: false,
            }),
          );
        }
        tamtru2.forEach((tt) => {
          dongGop.push(
            this.donggopRepo.create({
              nguoiTamTru: tt,
              soTienDongGop: soTien,
              trangThai: false,
            }),
          );
        });
      }
      if (dongGop) {
        await this.donggopRepo.save(dongGop);
      }
      await this.khoanphiRepo.save(
        this.khoanphiRepo.create({
          dongGop,
          nguoiTao,
          tenKhoanPhi,
          ngayPhatDong,
          ngayHetHan,
          theoHoKhau,
          loaiPhi,
          soTien,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Input', 'Lỗi server,thử lại sau');
    }
  }

  //xem chi tiết khoản phí dành cho quản lý
  async XemKhoanPhiChiTietChoQuanLi(
    input: XemKhoanPhiChiTietChoQuanLiInput,
  ): Promise<XemKhoanPhiChiTietChoQuanLiOutput> {
    try {
      const khoanphi = await this.khoanphiRepo.findOne({
        where: {
          id: input.khoanPhiId,
        },
      });
      var tongtien = 0;
      var nDaDong = 0;
      var nChuaDong = 0;
      if (!khoanphi) return createError('Input', 'Khoản phí này không tồn tại');
      const donggop = await this.donggopRepo.find({
        where: {
          khoanPhi: {
            id: input.khoanPhiId,
          },
        },
        relations: {
          hoKhau: true,
          nguoiTamTru: true,
        },
      });
      donggop.forEach((dg) => {
        if (dg.trangThai) {
          tongtien = tongtien + dg.soTienDongGop;
          nDaDong++;
        } else {
          nChuaDong++;
        }
      });
      return {
        ok: true,
        khoanphi,
        donggop,
        tongtien,
        nDaDong,
        nChuaDong,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  //xem danh sách  khoản phí dành cho quản lý
  async xemDanhSachKhoanPhiChoNguoiQuanLi(
    input: xemDanhSachKhoanPhiChoNguoiQuanLiInput,
  ): Promise<xemDanhSachKhoanPhiChoNguoiQuanLiOutput> {
    try {
      const {
        paginationInput: { page, resultsPerPage },
        theoHoKhau,
        tenKhoanPhi,
        loaiPhi,
      } = input;
      const [khoanPhi, totalResults] = await this.khoanphiRepo.findAndCount({
        where: {
          tenKhoanPhi: tenKhoanPhi ? ILike(`%${tenKhoanPhi}%`) : undefined,
          loaiPhi: loaiPhi || undefined,
          theoHoKhau: theoHoKhau || undefined,
        },
        skip: (page - 1) * resultsPerPage, // bỏ qua bao nhiêu bản ghi
        take: resultsPerPage, // lấy bao nhiêu bản ghi
        order: {
          updatedAt: SortOrder.DESC,
        }, // sắp xếp theo giá trị của trường cụ thể tuỳ mọi người truyền vào sao cho hợp lệ
      });

      return {
        ok: true,
        khoanPhi,
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
