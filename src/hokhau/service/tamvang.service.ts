import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortOrder } from 'src/common/entities/core.entity';
import { createError } from 'src/common/utils/createError';
import { User, VaiTroThanhVien } from 'src/user/entities/user.entity';
import { ILike, In, Repository } from 'typeorm';
import {
  AddTamVangInput,
  AddTamVangOutput,
  suaThongTinTamVangInput,
  suaThongTinTamVangOutput,
  xemDanhSachTamVangInput,
  xemDanhSachTamVangOutput,
  hetTamVangInput,
  hetTamVangOutput,
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
      if (user.vaiTroThanhVien == VaiTroThanhVien.ChuHo)
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
          ngayHetHieuLuc: null,
        },
      });
      if (TamVang) return createError('Input', 'Người này đang tạm vắng');

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
          ngayHetHieuLuc: null,
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

      const [tamVang, totalResults] = await this.TamVangRepo.findAndCount({
        where: {
          nguoiTamVang: {
            canCuocCongDan: canCuocCongDan
              ? ILike(`%${canCuocCongDan}%`)
              : undefined,
          },
        },
        relations: {
          nguoiTamVang: true,
        },
        skip: (page - 1) * resultsPerPage, // bỏ qua bao nhiêu bản ghi
        take: resultsPerPage, // lấy bao nhiêu bản ghi
        order: {
          updatedAt: SortOrder.DESC,
        }, // sắp xếp theo giá trị của trường cụ thể tuỳ mọi người truyền vào sao cho hợp lệ
      });
      console.log(tamVang);

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

  async suaThongTinTamVang(
    nguoiPheDuyet: User,
    input: suaThongTinTamVangInput,
  ): Promise<suaThongTinTamVangOutput> {
    try {
      const { nguoiYeuCauId, bangTamVangId, lyDoTamVang, diaChiNoiDenMoi } =
        input;

      const userYeuCau = await this.userRepo.findOne({
        where: { id: nguoiYeuCauId },
      });

      const TamVang = await this.TamVangRepo.findOne({
        where: {
          nguoiTamVang: {
            id: nguoiYeuCauId,
          },
          ngayHetHieuLuc: null,
        },
      });
      if (!TamVang)
        return createError(
          'Input',
          'Người yêu cầu chưa đăng ký tạm vắng hoặc đã hết hạn tạm vắng!',
        );

      const tamVang = await this.TamVangRepo.findOne({
        where: { id: bangTamVangId },
        select: ['nguoiTamVang', 'id'],
        relations: ['nguoiTamVang'],
      });

      if (userYeuCau.id !== tamVang.nguoiTamVang.id)
        return createError(
          'Input',
          'Không thể thực hiện yêu cầu do id của người yêu cầu sai!',
        );

      tamVang.lyDoTamVang = lyDoTamVang;
      tamVang.diaChiNoiDen = diaChiNoiDenMoi;
      tamVang.ngayBatDauTamVang = new Date();
      tamVang.nguoiPheDuyet = nguoiPheDuyet;

      await this.TamVangRepo.save(tamVang);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Input', 'Lỗi server,thử lại sau');
    }
  }
  //Cập nhật lại tình trạng khi có yêu cầu hết tạm vắng
  async hetTamVang(
    nguoiPheDuyet: User,
    input: hetTamVangInput,
  ): Promise<hetTamVangOutput> {
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

      //Kiểm tra người yêu cầu có hộ khẩu cư trú không
      if (!nguoiYeuCau.hoKhauId)
        return createError(
          'Input',
          'Người này không có hộ khẩu cư trú trong khu dân cư',
        );
      //kiểm tra người yêu cầu có đang trong tình trạng tạm vắng không
      const TamVang = await this.TamVangRepo.findOne({
        where: {
          nguoiTamVang: {
            id: nguoiYeuCau.id,
          },
          ngayHetHieuLuc: null,
        },
      });
      if (!TamVang)
        return createError(
          'Input',
          'Người yêu cầu chưa đăng ký tạm vắng hoặc đã hết hạn tạm vắng !',
        );

      const hoKhau = await this.hokhauRepo.findOne({
        where: { id: nguoiYeuCau.hoKhauId },
      });
      //cập nhật tình trạng tạm vắng
      hoKhau.ghiChu = nguoiYeuCau.ten + 'nguoi nay da het tam vang';
      TamVang.ngayHetHieuLuc = new Date();
      TamVang.nguoiPheDuyet = nguoiPheDuyet;
      await this.TamVangRepo.save(TamVang);
      await this.hokhauRepo.save(hoKhau);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
