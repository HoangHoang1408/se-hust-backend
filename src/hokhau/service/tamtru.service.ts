import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createError } from 'src/common/utils/createError';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import {
  AddTamTruInput,
  AddTamTruOutput,
  xemThongTinTamTruOutput,
} from '../dto/tamtru.dto';
import { TamTru } from '../entity/tamtru.entity';
@Injectable()
export class TamTruService {
  constructor(
    @InjectRepository(TamTru) private readonly tamTruRepo: Repository<TamTru>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  //    quản lý thêm tạm trú
  async addTamTru(
    nguoiPheDuyet: User,
    input: AddTamTruInput,
  ): Promise<AddTamTruOutput> {
    try {
      const { nguoiTamTruId, noiTamTruHienTai } = input;

      // kiểm tra người này có đang ở trong khu dân cư chưa
      const user = await this.userRepo.findOne({
        where: { id: nguoiTamTruId },
      });
      if (!user)
        return createError('Input', 'Người này đang chưa thêm vào khu dân phố');

      // kiểm tra người này có phải đã có hổ khẩu cư trú ở đây chưa
      if (user.hoKhauId)
        return createError(
          'Input',
          'Người này đang thường trú trong khu dân phố này',
        );

      // kiểm tra người đó đã tồn tại trong bảng tạm trú hay chưa
      const tamtru = await this.tamTruRepo.findOne({
        where: {
          nguoiTamTru: {
            id: nguoiTamTruId,
          },
        },
      });
      const now = new Date();
      const next_year = new Date(
        now.getFullYear() + 1,
        now.getMonth(),
        now.getDate(),
      );
      if (tamtru) return createError('Input', 'Người này đã được thêm tạm trú');

      await this.tamTruRepo.save(
        this.tamTruRepo.create({
          nguoiPheDuyet,
          nguoiTamTru: user,
          ngayHetHanTamTru: next_year,
          noiTamTruHienTai,
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
  async xemThongTinTamTru(currentUser: User): Promise<xemThongTinTamTruOutput> {
    try {
      const tamtru = await this.tamTruRepo.findOne({
        where: {
          nguoiTamTru: {
            id: currentUser.id,
          },
        },
      });
      if (!tamtru)
        return createError(
          'Input',
          'Người dùng không tồn tại trong bảng tạm trú',
        );
      return {
        ok: true,
        tamtru,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
