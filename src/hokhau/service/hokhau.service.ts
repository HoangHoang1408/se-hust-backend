import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortOrder } from 'src/common/entities/core.entity';
import { createError } from 'src/common/utils/createError';
import { User, VaiTroThanhVien } from 'src/user/entities/user.entity';
import { ILike, In, Like, Repository } from 'typeorm';
import {
  TachHoKhauInput,
  TachHoKhauOutput,
  ThemHoKhauInput,
  ThemHoKhauOutput,
  ThemNguoiVaoHoKhauInput,
  ThemNguoiVaoHoKhauOutput,
  XemHoKhauChiTietChoQuanLiInput,
  XemHoKhauChiTietChoQuanLiOutput,
  XemLichSuThayDoiNhanKhauInput,
  XemLichSuThayDoiNhanKhauOutput,
  XemDanhSachHoKhauInput,
  XemDanhSachHoKhauOutput,
  XoaNguoiKhoiHoKhauInput,
  XoaNguoiKhoiHoKhauOutput,
} from '../dto/hokhau.dto';
import { HoKhau } from '../entity/hokhau.entity';
import { HanhDongHoKhau, LichSuHoKhau } from '../entity/lichsuhokhau.entity';
@Injectable()
export class HokhauService {
  constructor(
    @InjectRepository(HoKhau) private readonly hoKhauRepo: Repository<HoKhau>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(LichSuHoKhau)
    private readonly lichSuHoKhauRepo: Repository<LichSuHoKhau>,
  ) {}
  // Tạo số của sổ hộ khẩu
  private generateSoHoKhau(): number {
    //generate random number
    return Math.floor(Math.random() * 1000000000);
  }

  // Xem thông tin hộ khẩu bởi quản lí
  async xemHoKhauChiTietChoQuanLi(
    input: XemHoKhauChiTietChoQuanLiInput,
  ): Promise<XemHoKhauChiTietChoQuanLiOutput> {
    try {
      const hoKhau = await this.hoKhauRepo.findOne({
        where: {
          id: input.hoKhauId,
        },
        relations: ['thanhVien'],
      });
      if (!hoKhau) return createError('Input', 'Không tìm thấy hộ khẩu');
      return {
        ok: true,
        hoKhau,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  // Xem thông tin hộ khẩu bởi người dùng
  async xemHoKhauChiTietChoNguoiDung(currentUser: User) {
    try {
      if (!currentUser.hoKhauId)
        return createError('Input', 'Bạn chưa đăng kí hộ khẩu');
      const hoKhau = await this.hoKhauRepo.findOne({
        where: {
          id: currentUser.hoKhauId,
        },
        relations: ['thanhVien'],
      });
      if (!hoKhau) return createError('Input', 'Không tìm thấy hộ khẩu');
      return {
        ok: true,
        hoKhau,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  // Thêm hộ khẩu
  async themHoKhau(
    nguoiPheDuyet: User,
    input: ThemHoKhauInput,
  ): Promise<ThemHoKhauOutput> {
    try {
      const { diaChiThuongTru, thanhVien, nguoiYeuCauId } = input;
      const idThanhVien = thanhVien.map((tv) => tv.id);

      // kiểm tra người yêu cầu có nằm trong danh sách thành viên không
      // TODO: Liệu rằng người yêu cầu có cần thiết phải là chủ hộ không?
      if (!idThanhVien.includes(nguoiYeuCauId))
        return createError(
          'Input',
          'Người yêu cầu tạo mới hộ khẩu không nằm trong thành viên hộ khẩu',
        );
      const nguoiYeuCau = await this.userRepo.findOne({
        where: {
          id: nguoiYeuCauId,
        },
      });
      if (!nguoiYeuCau)
        return createError('Input', 'Người yêu cầu không hợp lệ');

      // Kiểm tra các thành viên có hợp lệ để thêm không
      const users = await this.userRepo.find({
        where: {
          id: In(idThanhVien),
        },
      });
      if (!users || users.length == 0)
        return createError('Input', 'Thành viên không hợp lệ');
      const inValid = users.some((user) => user.hoKhauId);
      if (inValid)
        return createError('Input', 'Tồn tại thành viên đã đăng kí hộ khẩu');

      // TODO: Kiểm tra xem các thành viên có phù hợp với logic thông thường ko, vd: tuổi con nhỏ hơn tuổi bố mẹ, đã có chủ hộ chưa ...
      const soLuongChuHo = thanhVien.reduce(
        (acc, cur) =>
          acc + (cur.vaiTroThanhVien === VaiTroThanhVien.ChuHo ? 1 : 0),
        0,
      );
      if (soLuongChuHo !== 1)
        return createError('Input', 'Yêu cầu có duy nhất một chủ hộ mới');

      // cập nhật vai trò của các thành viên trong bảng ngưởi dùng
      users.forEach((user) => {
        user.vaiTroThanhVien = thanhVien.find(
          (tv) => +tv.id === +user.id,
        ).vaiTroThanhVien;
      });

      // tạo mới hộ khẩu trong cơ sở dữ liệu
      const hoKhau = await this.hoKhauRepo.save(
        this.hoKhauRepo.create({
          diaChiThuongTru,
          thanhVien: users,
          soHoKhau: this.generateSoHoKhau(),
        }),
      );
      await this.userRepo.save(users);

      // tạo lịch sử thay đổi hộ khẩu
      await this.lichSuHoKhauRepo.save(
        this.lichSuHoKhauRepo.create({
          hanhDong: HanhDongHoKhau.TaoMoiHoKhau,
          thoiGian: new Date(),
          hoKhau,
          nguoiPheDuyet,
          nguoiYeuCau,
        }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  // Tách hộ khẩu
  async tachHoKhau(
    nguoiPheDuyet: User,
    input: TachHoKhauInput,
  ): Promise<TachHoKhauOutput> {
    try {
      const {
        hoKhauId,
        thanhVienHoKhauMoi,
        diaChiThuongTruMoi,
        nguoiYeuCauId,
      } = input;
      // Tìm người yêu cầu
      const nguoiYeuCau = await this.userRepo.findOne({
        where: {
          id: nguoiYeuCauId,
        },
      });
      if (!nguoiYeuCau)
        return createError('Input', 'Người yêu cầu không hợp lệ');

      // A. kiểm tra hợp lệ
      // 0. Kiểm tra hộ khẩu có tồn tại không
      const hoKhauCu = await this.hoKhauRepo.findOne({
        where: {
          id: hoKhauId,
        },
        relations: {
          thanhVien: true,
        },
      });
      if (!hoKhauCu) return createError('Input', 'Không tìm thấy hộ khẩu');

      // 0. kiểm tra thành viên mới có thuộc hộ khẩu không
      const idThanhVienMoi = thanhVienHoKhauMoi.map((item) => +item.id);
      const idThanhVienCu = hoKhauCu.thanhVien.map((item) => +item.id);
      const thanhVienMoi = await this.userRepo.find({
        where: {
          id: In(idThanhVienMoi),
        },
      });
      // 1. kiểm tra người yêu cầu có thuộc hộ khẩu không
      if (!idThanhVienCu.includes(+nguoiYeuCauId))
        return createError('Input', 'Người yêu cầu không thuộc hộ khẩu');
      // 2. kiểm tra thành viên mới có thuộc hộ khẩu không
      for (const tv of thanhVienMoi) {
        if (tv.hoKhauId != hoKhauId)
          return createError(
            'Input',
            'Tổn tại thành viên trong hộ khẩu mới không thuộc hộ khẩu cũ',
          );
      }
      // 3. kiểm tra chủ hộ có bị tách ra khỏi hộ khẩu không
      for (const tv of thanhVienMoi) {
        if (tv.vaiTroThanhVien === VaiTroThanhVien.ChuHo) {
          return createError(
            'Input',
            'Không được tách chủ hộ từ sổ hộ khẩu cũ',
          );
        }
      }
      // 4. kiểm tra số lượng chủ hộ trong hộ khẩu mới
      const soLuongChuHo = thanhVienHoKhauMoi.reduce(
        (acc, cur) =>
          acc + (cur.vaiTroThanhVien === VaiTroThanhVien.ChuHo ? 1 : 0),
        0,
      );
      if (soLuongChuHo !== 1)
        return createError('Input', 'Yêu cầu có duy nhất một chủ hộ mới');

      // B. Tách hộ khẩu
      // 1. Cập nhật lại vai trò của các thành viên trong hộ khẩu mới
      thanhVienMoi.forEach((tv) => {
        tv.vaiTroThanhVien = thanhVienHoKhauMoi.find(
          (item) => +item.id === +tv.id,
        ).vaiTroThanhVien;
      });
      const hoKhauMoi = this.hoKhauRepo.create({
        diaChiThuongTru: diaChiThuongTruMoi,
        thanhVien: thanhVienMoi,
        soHoKhau: this.generateSoHoKhau(),
      });
      // 2. Cập nhật lại thành viên trong hộ khẩu cũ
      hoKhauCu.thanhVien = hoKhauCu.thanhVien.filter(
        (tv) => !idThanhVienMoi.includes(tv.id),
      );
      // 3. Tạo lịch sử thay đổi hộ khẩu
      const lichSu = this.lichSuHoKhauRepo.create({
        hanhDong: HanhDongHoKhau.TachHoKhau,
        thoiGian: new Date(),
        hoKhau: hoKhauCu,
        nguoiPheDuyet,
        nguoiYeuCau,
      });
      // 4. Lưu vào database
      await this.userRepo.save(thanhVienMoi);
      await this.hoKhauRepo.save([hoKhauCu, hoKhauMoi]);
      await this.lichSuHoKhauRepo.save(lichSu);

      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  // Thêm người vào hộ khẩu
  async themNguoiVaoHoKhau(
    nguoiPheDuyet: User,
    input: ThemNguoiVaoHoKhauInput,
  ): Promise<ThemNguoiVaoHoKhauOutput> {
    try {
      const { nguoiYeuCauId, nguoiMoi, hoKhauId } = input;
      //kiem tra ho khau can vao co ton tai trong khu dan pho khong
      const hoKhau = await this.hoKhauRepo.findOne({
        where: {
          id: hoKhauId,
        },
        relations: {
          thanhVien: true,
        },
      });
      if (!hoKhau) return createError('Input', 'Ho khau khong hop le');
      // kiem tra nguoi yeu cau co trong ho khau nay khong
      const nguoiYeuCau = await this.userRepo.findOne({
        where: {
          id: nguoiYeuCauId,
        },
      });
      if (!nguoiYeuCau || nguoiYeuCau.hoKhauId != hoKhauId)
        return createError('Input', 'Người yêu cầu không hợp lệ');
      // kiem tra nguoi them vao ton tai khong
      const thanhVienMoi = await this.userRepo.findOne({
        where: {
          id: nguoiMoi.id,
        },
      });
      if (!thanhVienMoi)
        return createError('Input', 'Thành viên này không tồn tại ');

      // kiem tra nguoi them vao da co trong ho khau chua
      if (thanhVienMoi.hoKhauId == hoKhauId)
        return createError(
          'Input',
          'Thành viên này đã tồn tại trong hộ khẩu này ',
        );
      // cap nhat vai tro cua thanh vien moi
      thanhVienMoi.vaiTroThanhVien = nguoiMoi.vaiTroThanhVien;

      // them thanh vien moi vao ho khau moi
      hoKhau.thanhVien.push(thanhVienMoi);
      await this.userRepo.save(thanhVienMoi);
      await this.hoKhauRepo.save(hoKhau);
      await this.lichSuHoKhauRepo.save(
        this.lichSuHoKhauRepo.create({
          hanhDong: HanhDongHoKhau.ThemThanhVien,
          thoiGian: new Date(),
          nguoiPheDuyet,
          nguoiYeuCau,
          hoKhau,
        }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  // Xóa hộ khẩu
  async xoaHoKhau() {}

  // Đổi chủ hộ
  async doiChuHo() {}

  //Xoa nguoi khoi ho khau
  async xoaNguoiKhoiHoKhau(
    nguoiPheDuyet: User,
    input: XoaNguoiKhoiHoKhauInput,
  ): Promise<XoaNguoiKhoiHoKhauOutput> {
    try {
      const { nguoiYeuCauId, nguoiCanXoaId, hoKhauId } = input;

      //kiem tra ho khau co ton tai trong khu dan pho khong
      const hoKhau = await this.hoKhauRepo.findOne({
        where: {
          id: hoKhauId,
        },
        relations: {
          thanhVien: true,
        },
      });
      if (!hoKhau) return createError('Input', 'Hộ khẩu không hợp lệ');

      //kiem tra nguoi yeu cau co trong ho khau hay khong
      const nguoiYeuCau = await this.userRepo.findOne({
        where: {
          id: nguoiYeuCauId,
        },
      });
      if (!nguoiYeuCau || nguoiYeuCau.hoKhauId !== hoKhau.id)
        return createError('Input', 'Người yêu cầu không hợp lệ');

      //kiem tra nguoi can xoa co trong ho khau hay khong
      const nguoiCanXoa = await this.userRepo.findOne({
        where: {
          id: nguoiCanXoaId,
        },
      });
      if (!nguoiCanXoa)
        return createError('Input', 'Nguoi can duoc xoa khong ton tai h');
      if (+nguoiCanXoa.hoKhauId !== +hoKhauId)
        return createError(
          'Input',
          'Nguoi can duoc xoa khong nam trong ho khau',
        );

      //kiem tra nguoi can xoa co phai chu ho khong
      if (nguoiCanXoa.vaiTroThanhVien == VaiTroThanhVien.ChuHo)
        return createError('Input', 'Nguoi can xoa khong hop le');

      // xoa nguoi can duoc xoa khoi ho khau
      nguoiCanXoa.hoKhau = null;
      nguoiCanXoa.vaiTroThanhVien = null;
      hoKhau.thanhVien.filter(function (e) {
        return e.id !== nguoiCanXoa.id;
      });
      await this.hoKhauRepo.save(hoKhau);
      await this.userRepo.save(nguoiCanXoa);
      await this.lichSuHoKhauRepo.save(
        this.lichSuHoKhauRepo.create({
          hanhDong: HanhDongHoKhau.XoaNguoiKhoiHoKhau,
          thoiGian: new Date(),
          nguoiPheDuyet,
          nguoiYeuCau,
          hoKhau,
        }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async xemLichSuThayDoiNhanKhau(
    input: XemLichSuThayDoiNhanKhauInput,
  ): Promise<XemLichSuThayDoiNhanKhauOutput> {
    try {
      if (!input.hoKhauId) return createError('Input', 'Không có hộ khẩu');
      const lichSuHoKhau = await this.lichSuHoKhauRepo.find({
        where: {
          hoKhau: {
            id: input.hoKhauId,
          },
        },
        relations: {
          nguoiPheDuyet: true,
          nguoiYeuCau: true,
          hoKhau: true,
        }
      });
      if (!lichSuHoKhau) return createError('Input', 'Không tìm thấy hộ khẩu');
      console.log(lichSuHoKhau);
      return {
        ok: true,
        lichSuHoKhau,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  // xem danh sách hộ khẩu
  async xemDanhSachHoKhau(
    input: XemDanhSachHoKhauInput,
  ): Promise<XemDanhSachHoKhauOutput> {
    try {
      const {
        paginationInput: { page, resultsPerPage },
        hoTen,
        canCuocCongDan,
        soHoKhau,
      } = input;

      const thanhVien = await this.userRepo.find({
        where: {
          ten: hoTen ? ILike(`%${hoTen}%`) : undefined,
          canCuocCongDan: canCuocCongDan
            ? ILike(`%${canCuocCongDan}%`)
            : undefined,
        },
      });

      const idHoKhau = thanhVien.map((tv) => tv.hoKhauId);
      const [hoKhau, totalResults] = await this.hoKhauRepo.findAndCount({
        where: [
          {
            id: In(idHoKhau),
          },
          {
            soHoKhau: soHoKhau ? soHoKhau : undefined,
          },
        ],
        relations: {
          thanhVien: true,
        },
        skip: (page - 1) * resultsPerPage, // bỏ qua bao nhiêu bản ghi
        take: resultsPerPage, // lấy bao nhiêu bản ghi
        order: {
          updatedAt: SortOrder.DESC,
        }, // sắp xếp theo giá trị của trường cụ thể tuỳ mọi người truyền vào sao cho hợp lệ
      });

      return {
        ok: true,
        hoKhau,
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
