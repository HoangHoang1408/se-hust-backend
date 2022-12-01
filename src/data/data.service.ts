import { faker } from '@faker-js/faker/locale/vi';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { range, sample, sampleSize } from 'lodash';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

const alphabetLetters = range(26)
  .map((e) => [
    String.fromCharCode(e + 'a'.charCodeAt(0)),
    String.fromCharCode(e + 'A'.charCodeAt(0)),
  ])
  .flat();

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    //  this.generateUserData(100);
  }

  // generate dữ liệu người dùng vào csdl
  async generateUserData(soLuong: number) {
    const ho = [
      'Phạm',
      'Nguyễn',
      'Trần',
      'Trương',
      'Đỗ',
      'Mã',
      'Vũ',
      'Đặng',
      'Phan',
      'Hoàng',
      'Huỳnh',
      'Lê',
    ];
    const tenDem = [
      'Văn',
      'Thuỳ',
      'Thị',
      'Hoàng',
      'Việt',
      'An',
      'Đức',
      'Khánh',
      'Nhật',
      'Khánh',
      'Quỳnh',
      'Xuân',
      'Nhật',
      'Ngọc',
    ];
    const ten = [
      'An',
      'Dương',
      'Bình',
      'Bảo',
      'Hoàng',
      'Đức',
      'Khang',
      'Thành',
      'Linh',
      'Tú',
      'Huy',
      'Tùng',
      'Công',
      'Cường',
      'Anh',
      'Nguyệt',
      'Vi',
      'Diệp',
      'Hà',
      'Hiền',
      'Phương',
      'Thương',
    ];
    const ngheNghiep = [
      'Giáo viên',
      'Nông dân',
      'Công nhân',
      'Bộ đội',
      'Nội trợ',
      'Bác sĩ',
      'Y tá',
      'Lao động tự do',
      'Nhân viên',
    ];
    const noiSinh = [
      'Hoà Bình',
      'Sơn La',
      'Hà Giang',
      'Phú Thọ',
      'Bắc Giang',
      'Thái Bình',
      'Nam Định',
      'Hà Nội',
    ];
    const dauSoDT = [
      '032',
      '033',
      '034',
      '093',
      '094',
      '090',
      '076',
      '077',
      '078',
    ];
    const datas = range(soLuong).map(() => {
      const temp = `${sampleSize(alphabetLetters, sample([4, 5, 6])).join(
        '',
      )}, ${sampleSize(alphabetLetters, sample([4, 5, 6])).join('')}, ${sample(
        noiSinh,
      )}`;

      const start = new Date(1945, 0, 1);
      const end = new Date(2022, 0, 1);
      return this.userRepo.save(
        this.userRepo.create({
          ten: `${sample(ho)} ${sample(tenDem)} ${sample(ten)}`,
          biDanh: `Bi danh ${sampleSize(alphabetLetters, 4).join('')}`,
          canCuocCongDan: `034${sampleSize(range(0, 10), 9).join('')}`,
          ngheNghiep: sample(ngheNghiep),
          danToc: 'Kinh',
          daDangKi: false,
          noiSinh: temp,
          queQuan: temp,
          noiThuongTruTruocDo: `${sampleSize(
            alphabetLetters,
            sample([4, 5, 6]),
          ).join('')}, ${sampleSize(alphabetLetters, sample([4, 5, 6])).join(
            '',
          )}, ${sample(noiSinh)}`,
          soDienThoai: `${sample(dauSoDT)}${sampleSize(range(0, 10), 7).join(
            '',
          )}`,
          ngaySinh: faker.date.between(start, end),
          gioiTinh: sample(['Nam', 'Nữ']),
          tamTru: null,
          tamVang: false,
          noiLamViec: `${sampleSize(alphabetLetters, sample([4, 5, 6])).join(
            '',
          )}, ${sampleSize(alphabetLetters, sample([4, 5, 6])).join(
            '',
          )}, ${sample(noiSinh)}`,
          ngayDangKiThuongTru: faker.date.between(start, end),
        }),
      );
    });

    await Promise.all(datas);
    console.log('User data inserted!');
  }
}
