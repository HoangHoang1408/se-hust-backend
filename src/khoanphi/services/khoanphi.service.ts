import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortOrder } from 'src/common/entities/core.entity';
import { createError } from 'src/common/utils/createError';
import { HoKhau } from 'src/hokhau/entity/hokhau.entity';
import { TamTru } from 'src/hokhau/entity/tamtru.entity';
import { User } from 'src/user/entities/user.entity';
import { ILike, In, Repository } from 'typeorm';
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
        const hokhau = await this.hokhauRepo.find();
        const tamtru = await this.tamtruRepo.find();
        hokhau.forEach((hk) => {
          dongGop.push(
            this.donggopRepo.create({
              hoKhau: hk,
              soTienDongGop: soTien,
              trangThai: false,
            }),
          );
        });
        tamtru.forEach((tt) => {
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
      if (!khoanphi) return createError('Input', 'Khoản phí này không tồn tại');
      return {
        ok: true,
        khoanphi,
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
      } = input;

      const khoanPhi = await this.khoanphiRepo.find({
        where: {
          tenKhoanPhi: tenKhoanPhi ? ILike(`%${tenKhoanPhi}%`) : undefined,
          loaiPhi: theoHoKhau ? ILike(`%${theoHoKhau}%`) : undefined,
        },
      });

      const idKhoanPhi = khoanPhi.map((kp) => kp.id);
      const [KhoanPhi, totalResults] = await this.khoanphiRepo.findAndCount({
        where: [
          {
            id: In(idKhoanPhi),
          },
        ],
        skip: (page - 1) * resultsPerPage, // bỏ qua bao nhiêu bản ghi
        take: resultsPerPage, // lấy bao nhiêu bản ghi
        order: {
          updatedAt: SortOrder.DESC,
        }, // sắp xếp theo giá trị của trường cụ thể tuỳ mọi người truyền vào sao cho hợp lệ
      });

      return {
        ok: true,
        khoanPhi: KhoanPhi,
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
