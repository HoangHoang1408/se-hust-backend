import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createError } from 'src/common/utils/createError';
import { User, VaiTroThanhVien } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import {
  TachHoKhauInput,
  TachHoKhauOutput,
  ThemHoKhauInput,
  ThemHoKhauOutput,
  XemHoKhauChiTietChoQuanLiInput,
  XemHoKhauChiTietChoQuanLiOutput,
} from './dto/hokhau.dto';
import { HoKhau } from './entity/hokhau.entity';
import { HanhDongHoKhau, LichSuHoKhau } from './entity/lichsuhokhau.entity';
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
      const idThanhVienMoi = thanhVienHoKhauMoi.map((item) => item.id);
      const idThanhVienCu = hoKhauCu.thanhVien.map((item) => item.id);
      const thanhVienMoi = await this.userRepo.find({
        where: {
          id: In(idThanhVienMoi),
        },
      });

      // 1. kiểm tra người yêu cầu có thuộc hộ khẩu không
      if (!idThanhVienCu.includes(nguoiYeuCauId))
        return createError('Input', 'Người yêu cầu không thuộc hộ khẩu');

      // 2. kiểm tra thành viên mới có thuộc hộ khẩu không
      for (const tv of thanhVienMoi) {
        if (tv.hoKhauId !== hoKhauId)
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
      await this.hoKhauRepo.save([hoKhauCu, hoKhauMoi]);

      // 3. Tạo lịch sử thay đổi hộ khẩu
      await this.lichSuHoKhauRepo.save(
        this.lichSuHoKhauRepo.create({
          hanhDong: HanhDongHoKhau.TachHoKhau,
          thoiGian: new Date(),
          hoKhau: hoKhauCu,
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

  // Thêm người vào hộ khẩu
  async themNguoiVaoHoKhau() {}

  // Xóa hộ khẩu
  async xoaHoKhau() {}
}
