import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createError } from 'src/common/utils/createError';
import { Repository } from 'typeorm';
import {
  AddTamTruInput,
  AddTamTruOutput,
  AddUserInput,
  AddUserOutput,
  XemThongTinNguoiDungChoQuanLiInput,
  XemThongTinNguoiDungOutput,
} from './dto/user.dto';
import { TamTru } from './entities/tamtru.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(TamTru)
    private readonly tamTruRepo: Repository<TamTru>,
  ) { }

  // quản lí thêm người dùng
  async addUser(input: AddUserInput): Promise<AddUserOutput> {
    try {
      const user = this.userRepo.findOne({
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
  //    quản lý thêm tạm trú
  async addTamTru(
    nguoiPheDuyet: User,
    input: AddTamTruInput,
  ): Promise<AddTamTruOutput> {
    try {
      const {
        nguoiTamTruId,
        noiTamTruHienTai,
      } = input;
      // kiểm tra người này có đang ở trong khu dân cư chưa
      const user = await this.userRepo.findOne({
        where: { id: nguoiTamTruId },
      });
      if (!user) return createError('Input', "Người này đang chưa thêm vào khu dân phố");
      // xem người phê duyệt có phải là tổ trường or tổ phó không
      if (nguoiPheDuyet.vaiTroNguoiDung != 'ToTruong')
        if (nguoiPheDuyet.vaiTroNguoiDung != 'ToPho')
          return createError('Input', "Người phê duyệt không hợp lệ");
      await this.tamTruRepo.save(this.tamTruRepo.create({
        nguoiPheDuyet,
        userTamTru: user,
        noiTamTruHienTai: noiTamTruHienTai,
      }))
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Input', 'Lỗi server,thủ lại sau');
    }
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
}
