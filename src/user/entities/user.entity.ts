import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { compare, hash } from 'bcrypt';
import {
  IsIn,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { HoKhau } from 'src/hokhau/entity/hokhau.entity';
import { StoredFile } from 'src/upload/object/StoredFile';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  RelationId,
} from 'typeorm';

export enum VaitroNguoiDung {
  Admin = 'Admin',
  NguoiDan = 'NguoiDan',
  ToTruong = 'ToTruong',
  ToPho = 'ToPho',
}

export enum VaiTroThanhVien {
  ChuHo = 'Chủ hộ',
  Vo = 'Vợ',
  Chong = 'Chồng',
  Con = 'Con',
  Bo = 'Bố',
  Me = 'Mẹ',
  Chau = 'Cháu',
  Chat = 'Chắt',
  ConNuoi = 'Con nuôi',
  Anh = 'Anh',
  Chi = 'Chị',
  Em = 'Em',
  Ong = 'Ông',
  Ba = 'Bà',
  Khac = 'Khác',
}

registerEnumType(VaitroNguoiDung, {
  name: 'VaitroNguoiDung',
});
registerEnumType(VaiTroThanhVien, {
  name: 'VaiTroThanhVien',
});

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  @Length(12, 12)
  canCuocCongDan: string;

  @Field({ nullable: true })
  @Column({ select: false, nullable: true })
  @IsString()
  matKhau: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsPhoneNumber('VN', {
    message: 'Số điện thoại sai định dạng',
  })
  soDienThoai?: string;

  @Field(() => VaitroNguoiDung)
  @Column('enum', {
    enum: VaitroNguoiDung,
    default: VaitroNguoiDung.NguoiDan,
  })
  vaiTroNguoiDung: VaitroNguoiDung;

  @Field(() => VaiTroThanhVien, { nullable: true })
  @Column('enum', {
    enum: VaiTroThanhVien,
    nullable: true,
  })
  vaiTroThanhVien?: VaiTroThanhVien;

  @Field()
  @Column({ default: false })
  daDangKi: boolean;

  @Field()
  @Column()
  @IsString()
  ten: string;

  @Field()
  @Column()
  @IsIn(['Nam', 'Nữ'])
  gioiTinh: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  biDanh?: string;

  @Field(() => Date)
  @Column('timestamp without time zone')
  ngaySinh: Date;

  @Field()
  @Column()
  noiSinh: string;

  @Field()
  @Column()
  queQuan: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  noiThuongTruTruocDo?: string;

  @Field({ nullable: true })
  @Column('timestamp without time zone', { nullable: true })
  ngayDangKiThuongTru?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ngheNghiep?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  noiLamViec?: string;

  @Field()
  @Column()
  danToc: string;

  @Field(() => StoredFile, { nullable: true })
  @Column('json', { nullable: true })
  @ValidateNested()
  @IsOptional()
  avatar?: StoredFile;

  @Field({ nullable: true })
  @Column({ nullable: true })
  tamTru?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ghiChu?: string;

  // liên kết với hộ khẩu
  @Field(() => HoKhau, { nullable: true })
  @ManyToOne(() => HoKhau, (hokhau) => hokhau.thanhVien, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  hoKhau?: HoKhau;

  @RelationId((user: User) => user.hoKhau)
  hoKhauId?: number;

  // phương thức xử lí password
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.matKhau) return;
    this.matKhau = await hash(this.matKhau, 12);
  }

  async checkPassword(matKhau: string): Promise<Boolean> {
    return await compare(matKhau, this.matKhau);
  }
}
