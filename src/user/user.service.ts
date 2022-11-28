import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createError } from 'src/common/utils/createError';
import { Repository } from 'typeorm';
import {
  AddUserInput,
  AddUserOutput,
  XemThongTinNguoiDungChoQuanLiInput,
  XemThongTinNguoiDungOutput,
} from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
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
}
