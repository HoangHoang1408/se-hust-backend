import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createError } from 'src/common/utils/createError';
import { Repository } from 'typeorm';
import {
  AddUserInput,
  AddUserOutput,
  UserDetailInput,
  UserDetailOutput,
} from './dto/user.dto';
import { User, VaitroNguoiDung } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
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

  async getUserDetail(
    currentUser: User,
    { id }: UserDetailInput,
  ): Promise<UserDetailOutput> {
    try {
      if (
        ![VaitroNguoiDung.ToPho, VaitroNguoiDung.ToTruong].includes(
          currentUser.vaiTro,
        ) &&
        +currentUser.id !== +id
      )
        return createError('Input', 'Bạn không có quyền xem thông tin này');
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) return createError('Input', 'Id không hợp lệ');
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
