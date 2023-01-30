import { HoKhau } from './../hokhau/entity/hokhau.entity';
import { TamVang } from './../hokhau/entity/tamvang.entity';
import { TamTru } from './../hokhau/entity/tamtru.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omitBy } from 'lodash';
import { SortOrder } from 'src/common/entities/core.entity';
import { createError } from 'src/common/utils/createError';
import { ILike, Repository, IsNull, In, LessThan, MoreThan } from 'typeorm';
import {
  AddUserInput,
  AddUserOutput,
  EditUserInput,
  EditUserOutput,
  XemDanhSachNguoiDungInput,
  XemDanhSachNguoiDungOutput,
  XemThongTinNguoiDungChoQuanLiInput,
  XemThongTinNguoiDungOutput,
  ThongKeUserOuput,
} from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(TamTru) private readonly tamTruRepo: Repository<TamTru>,
    @InjectRepository(TamVang)
    private readonly tamVangRepo: Repository<TamVang>,
    @InjectRepository(HoKhau) private readonly hoKhauRepo: Repository<HoKhau>,
  ) {}

  // quản lí thêm người dùng
  async addUser(input: AddUserInput): Promise<AddUserOutput> {
    try {
      const user = await this.userRepo.findOne({
        where: {
          canCuocCongDan: input.canCuocCongDan,
        },
      });
      if (user) return createError('Input', 'Đã tồn tại căn cước công dân này');
      await this.userRepo.save(this.userRepo.create({ ...input }));
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
    return {
      ok: true,
    };
  }

  // xem thông tin người dùng cho người dùng thông thường
  async xemThongTinNguoiDung(
    currentUser: User,
  ): Promise<XemThongTinNguoiDungOutput> {
    try {
      const user = await this.userRepo.findOne({
        where: { id: currentUser.id },
      });
      if (!user) return createError('Input', 'Người dùng không tồn tại');
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  // xem thông tin người dùng cho quản lí
  async xemThongTinNguoiDungChoQuanLi(
    input: XemThongTinNguoiDungChoQuanLiInput,
  ): Promise<XemThongTinNguoiDungOutput> {
    try {
      const user = await this.userRepo.findOne({
        where: { id: input.userId },
      });
      if (!user) return createError('Input', 'Người dùng không tồn tại');
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async editUser(input: EditUserInput): Promise<EditUserOutput> {
    try {
      const { nguoiYeuCauId } = input;
      const nguoiYeuCau = await this.userRepo.findOne({
        where: {
          id: nguoiYeuCauId,
        },
      });
      if (!nguoiYeuCau)
        return createError('Input', 'Người yêu cầu không hợp lệ');

      // ghi đè các trường input không bị null hoặc undefined vào trong nguoiYeuCau

      const updateUser = {
        ...nguoiYeuCau,
        ...omitBy(input, (v) => v == null || v == undefined),
      };
      this.userRepo.save(updateUser);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  // xem danh sach nguoi dung cho quan li
  async xemDanhSachNguoiDung(
    input: XemDanhSachNguoiDungInput,
  ): Promise<XemDanhSachNguoiDungOutput> {
    try {
      const {
        paginationInput: { page, resultsPerPage },
        hoTen,
        canCuocCongDan,
      } = input;
      const [users, totalResults] = await this.userRepo.findAndCount({
        where: {
          ten: hoTen ? ILike(`%${hoTen}%`) : undefined,
          canCuocCongDan: canCuocCongDan
            ? ILike(`%${canCuocCongDan}%`)
            : undefined,
        },
        skip: (page - 1) * resultsPerPage, // bỏ qua bao nhiêu bản ghi
        take: resultsPerPage, // lấy bao nhiêu bản ghi
        order: {
          updatedAt: SortOrder.DESC,
        }, // sắp xếp theo giá trị của trường cụ thể tuỳ mọi người truyền vào sao cho hợp lệ
      });
      return {
        ok: true,
        users,
        paginationOutput: {
          totalResults,
          totalPages: Math.ceil(totalResults / resultsPerPage),
        },
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async thongKeUser(): Promise<ThongKeUserOuput> {
    try {
      const numberOfUser = await this.userRepo.count();
      const numberOfUserTamTru = await this.tamTruRepo.count({
        where: {
          ngayHetHieuLuc: IsNull(),
        },
      });
      const numberOfUserTamVang = await this.tamVangRepo.count({
        where: {
          ngayHetHieuLuc: IsNull(),
        },
      });
      const soHo = await this.hoKhauRepo.count();

      const now = new Date();
      const check15 = new Date(
        now.getFullYear() - 15,
        now.getMonth(),
        now.getDate(),
      );
      const check60 = new Date(
        now.getFullYear() - 60,
        now.getMonth(),
        now.getDate(),
      );
      const check62 = new Date(
        now.getFullYear() - 62,
        now.getMonth(),
        now.getDate(),
      );
      const soNguoiDuoiLaoDong = await this.userRepo.count({
        where: {
          ngaySinh: MoreThan(check15),
        },
      });
      const soNguoiNgoaiLaoDongNu = await this.userRepo.count({
        where: {
          ngaySinh: LessThan(check60),
          gioiTinh: 'Nữ',
        },
      });

      const soNguoiNgoaiLaoDongNam = await this.userRepo.count({
        where: {
          ngaySinh: LessThan(check62),
          gioiTinh: 'Nam',
        },
      });

      const soNguoiNgoaiLaoDong =
        soNguoiNgoaiLaoDongNam + soNguoiNgoaiLaoDongNu;
      return {
        ok: true,
        soNguoiDangKi: numberOfUser,
        soNguoiDangKiTamTru: numberOfUserTamTru,
        soNguoiDangKiTamVang: numberOfUserTamVang,
        soHo: soHo,
        soNguoiDuoiLaoDong: soNguoiDuoiLaoDong,
        soNguoiTrongLaoDong:
          numberOfUser - soNguoiDuoiLaoDong - soNguoiNgoaiLaoDong,
        soNguoiTrenLaoDong: soNguoiNgoaiLaoDong,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
