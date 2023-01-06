import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortOrder } from 'src/common/entities/core.entity';
import { createError } from 'src/common/utils/createError';
import { User } from 'src/user/entities/user.entity';
import { ILike, In, Repository } from 'typeorm';
import {
  AddTamVangInput,
  AddTamVangOutput,
  xemDanhSachTamVangInput,
  xemDanhSachTamVangOutput,
} from '../dto/tamvang.dto';
import { HoKhau } from '../entity/hokhau.entity';
import { HanhDongHoKhau, LichSuHoKhau } from '../entity/lichsuhokhau.entity';
import { TamVang } from '../entity/tamvang.entity';

@Injectable()
export class TamVangService {
  constructor(
    @InjectRepository(TamVang)
    private readonly TamVangRepo: Repository<TamVang>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(HoKhau) private readonly hokhauRepo: Repository<HoKhau>,
    @InjectRepository(LichSuHoKhau)
    private readonly lichsuhokhauRepo: Repository<LichSuHoKhau>,
  ) {}

  //    quản lý thêm tạm vắng
  async addTamVang(
    nguoiPheDuyet: User,
    input: AddTamVangInput,
  ): Promise<AddTamVangOutput> {
    try {
      const { nguoiTamVangId, lyDoTamVang, diaChiNoiDen } = input;

      const user = await this.userRepo.findOne({
        where: { id: nguoiTamVangId },
      });
      // kiểm tra người này có đang ở trong khu dân cư chưa
      if (!user)
        return createError('Input', 'Người này không có trong khu dân phố');

      // kiểm tra người này có phải chủ hộ hay không
      if (user.vaiTroThanhVien == 'Chủ hộ')
        return createError(
          'input',
          'Cần chuyển vai trò thành viên của người này',
        );
      // kiểm tra người này có phải đã có hổ khẩu cư trú ở đây chưa
      if (!user.hoKhauId)
        return createError(
          'Input',
          'Người này không thường trú trong khu dân phố này',
        );

      // kiểm tra người đó đã tồn tại trong bảng tạm vắng hay chưa
      const TamVang = await this.TamVangRepo.findOne({
        where: {
          nguoiTamVang: {
            id: user.id,
          },
        },
      });
      if (TamVang)
        return createError('Input', 'Người này đã được thêm tạm vắng');

      // ghi chú trong hộ khẩu người này đã tạm vắng tại khu dân phố
      // lưu lịch sử tạm vắng trong bảng lịch sử hộ khẩu
      const hoKhau = await this.hokhauRepo.findOne({
        where: { id: user.hoKhauId },
      });
      hoKhau.ghiChu = user.ten + ' đang tạm vắng tại địa phương.\n';
      // lưu dữ liệu vào database
      await this.hokhauRepo.save(hoKhau);
      await this.lichsuhokhauRepo.save(
        this.lichsuhokhauRepo.create({
          hanhDong: HanhDongHoKhau.DangKyTamVang,
          thoiGian: new Date(),
          nguoiPheDuyet,
          nguoiYeuCau: user,
          hoKhau,
        }),
      );

      await this.TamVangRepo.save(
        this.TamVangRepo.create({
          nguoiPheDuyet,
          nguoiTamVang: user,
          ngayBatDauTamVang: new Date(),
          lyDoTamVang,
          diaChiNoiDen,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Input', 'Lỗi server,thử lại sau');
    }
  }
  async xemDanhSachTamVang(
    input: xemDanhSachTamVangInput,
  ): Promise<xemDanhSachTamVangOutput> {
    try {
      const {
        paginationInput: { page, resultsPerPage },
        canCuocCongDan,
      } = input;

      const tamVang = await this.TamVangRepo.find({
        where: {
          nguoiTamVang: {
            canCuocCongDan: canCuocCongDan
              ? ILike(`%${canCuocCongDan}%`)
              : undefined,
          },
        },
      });

      const idTamVang = tamVang.map((tv) => tv.id);
      const [TamVang, totalResults] = await this.TamVangRepo.findAndCount({
        where: [
          {
            id: In(idTamVang),
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
        tamVang: tamVang,
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
