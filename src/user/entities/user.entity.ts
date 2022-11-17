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
import { StoredFile } from 'src/upload/object/StoredFile';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
export enum VaitroNguoiDung {
  Admin = 'Admin',
  NguoiDan = 'NguoiDan',
  ToTruong = 'ToTruong',
  ToPho = 'ToPho',
}
registerEnumType(VaitroNguoiDung, {
  name: 'VaitroNguoiDung',
});

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field()
  @Column()
  @Length(12, 12)
  canCuocCongDan: string;

  @Field()
  @Column()
  @IsPhoneNumber('VN', {
    message: 'Số điện thoại sai định dạng',
  })
  soDienThoai: string;

  @Field(() => VaitroNguoiDung)
  @Column('enum', {
    enum: VaitroNguoiDung,
    default: VaitroNguoiDung.NguoiDan,
  })
  vaiTro: VaitroNguoiDung;

  @Field()
  @Column({ default: false })
  daDangKi: boolean;

  @Field({ nullable: true })
  @Column({ select: false, nullable: true })
  @IsString()
  matKhau: string;

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
  @IsOptional()
  @IsString()
  biDanh?: string;

  @Field(() => Date)
  @Column('timestamp without time zone')
  @IsString()
  ngaySinh: Date;

  @Field()
  @Column()
  noiSinh: string;

  @Field()
  @Column()
  queQuan: string;

  @Field()
  @Column()
  noiThuongTruTruocDo: string;

  @Field()
  @Column()
  ngheNghiep: string;

  @Field()
  @Column()
  danToc: string;

  @Field(() => StoredFile, { nullable: true })
  @Column('json', { nullable: true })
  @ValidateNested()
  avatar?: StoredFile;

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
