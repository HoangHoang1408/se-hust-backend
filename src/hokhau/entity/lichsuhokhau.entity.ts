import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { HoKhau } from './hokhau.entity';

export enum HanhDongHoKhau {
  TaoMoiHoKhau = 'Tạo mới hộ khẩu',
  ThemThanhVien = 'Thêm thành viên',
  XoaThanhVien = 'Xóa thành viên',
  ThayDoiChuHo = 'Thay đổi chủ hộ',
  ThayDoiDiaChi = 'Thay đổi địa chỉ',
  ThayDoiVaiTro = 'Thay đổi vai trò',
  TachHoKhau = 'Tách hộ khẩu',
  XoaHoKhau = 'Xóa hộ khẩu',
  XoaNguoiKhoiHoKhau = 'Xóa người khỏi hộ khẩu',
  DangKyTamVang="Đăng ký tạm vắng",
}
registerEnumType(HanhDongHoKhau, {
  name: 'LoaiThayDoiHoKhau',
});

@InputType('LichSuHoKhauInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class LichSuHoKhau extends CoreEntity {
  @Field(() => HanhDongHoKhau)
  @Column()
  hanhDong: HanhDongHoKhau;

  @Field(() => Date)
  @Column('timestamp without time zone')
  thoiGian: Date;

  @Field(() => HoKhau)
  @ManyToOne(() => HoKhau, (hokhau) => hokhau.lichSuHoKhau)
  hoKhau: HoKhau;

  @Field(() => User)
  @ManyToOne(() => User)
  nguoiPheDuyet: User;

  @Field(() => User)
  @ManyToOne(() => User)
  nguoiYeuCau: User;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ghiChu?: string;
}
