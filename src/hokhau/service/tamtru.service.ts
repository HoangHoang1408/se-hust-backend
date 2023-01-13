import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortOrder } from 'src/common/entities/core.entity';
import { createError } from 'src/common/utils/createError';
import { User } from 'src/user/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import {
  AddTamTruInput,
  AddTamTruOutput,
  suaThongTinTamTruInput,
  suaThongTinTamTruOutput,
  xemDanhSachTamTruInput,
  xemDanhSachTamTruOutput,
  XoaTamTruInput,
  XoaTamTruOutput,
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
  async xemDanhSachTamTru(
    input: xemDanhSachTamTruInput,
  ): Promise<xemDanhSachTamTruOutput> {
    try {
      const {
        paginationInput: { page, resultsPerPage },
        canCuocCongDan,
      } = input;
      const [tamTru, totalResults] = await this.tamTruRepo.findAndCount({
        where: {
          nguoiTamTru: {
            canCuocCongDan: canCuocCongDan
              ? ILike(`%${canCuocCongDan}%`)
              : undefined,
          },
        },
        relations: {
          nguoiTamTru: true,
        },
        skip: (page - 1) * resultsPerPage,
        take: resultsPerPage,
        order: {
          updatedAt: SortOrder.DESC,
        },
      });
      return {
        ok: true,
        tamTru,
        paginationOutput: {
          totalResults,
          totalPages: Math.ceil(totalResults / resultsPerPage),
        },
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async suaThongTinTamTru(
    nguoiPheDuyet: User,
    input: suaThongTinTamTruInput,
  ): Promise<suaThongTinTamTruOutput> {
    try {
      const { nguoiYeuCauId, bangTamTruId, noiTamTruMoi } = input;

      const userYeuCau = await this.userRepo.findOne({
        where: { id: nguoiYeuCauId },
        select: ['id'],
      });
      if (!userYeuCau)
        return createError(
          'Input',
          'Người yêu cầu đang không ở trong khu dân phố ',
        );
      if (userYeuCau.hoKhauId)
        return createError(
          'Input',
          'Người yêu cầu đang thường trú trong khu dân phố này',
        );

      const tamTru = await this.tamTruRepo.findOne({
        where: { id: bangTamTruId },
        select: ['nguoiTamTru', 'id'],
        relations: ['nguoiTamTru'],
      });
      if (!tamTru)
        return createError(
          'Input',
          'Thông tin id của bảng tạm trú sai hoặc không tồn tại!',
        );

      if (userYeuCau.id !== tamTru.nguoiTamTru.id)
        return createError(
          'Input',
          'Không thể thực hiện yêu cầu do id của người yêu cầu sai!',
        );

      const now = new Date();
      const next_year = new Date(
        now.getFullYear() + 1,
        now.getMonth(),
        now.getDate(),
      );

      tamTru.nguoiPheDuyet = nguoiPheDuyet;
      tamTru.noiTamTruHienTai = noiTamTruMoi;
      tamTru.ngayHetHanTamTru = next_year;

      await this.tamTruRepo.save(tamTru);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Input', 'Lỗi server,thử lại sau');
    }
  }
  async xoaTamTru(
    nguoiPheDuyet: User,
    input: XoaTamTruInput,
  ): Promise<XoaTamTruOutput> {
    try {
      const { nguoiYeuCauId } = input;

      //kiểm tra người yêu cầu đã trong khu dân cư chưa
      const nguoiYeuCau = await this.userRepo.findOne({
        where: {
          id: nguoiYeuCauId,
        },
      });
      if (!nguoiYeuCau)
        return createError('Input', 'Người yêu cầu không có trong khu dân cư');

      //Kiểm tra người yêu cầu có phải chủ hộ không
      if (nguoiYeuCau.vaiTroThanhVien == 'Chủ hộ')
        return createError('Input', 'Cần chuyển vai trò thành viên');
      //Kiểm tra người yêu cầu có hộ khẩu cư trú ở đây không
      if (!nguoiYeuCau.hoKhauId)
        return createError(
          'Input',
          'Người này không có hộ khẩu cư trú trong khu dân cư',
        );
      //kiểm tra người yêu cầu có đang trong tình trạng tạm trú không
      const TamTru = await this.tamTruRepo.findOne({
        where: {
          nguoiTamTru: {
            id: nguoiYeuCauId,
          },
        },
      });
      if (!TamTru)
        return createError('Input', 'Người yêu cầu chưa đăng ký tạm trú!');
      //xóa tạm trú
      await this.tamTruRepo.delete(TamTru.id);
      //lưu vào database
      await this.tamTruRepo.save(
        this.tamTruRepo.create({
          nguoiPheDuyet,
          nguoiTamTru: nguoiYeuCau,
        }),
      );
      this.tamTruRepo.save(nguoiYeuCau);

      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
