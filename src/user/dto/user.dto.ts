import { Field, ID, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class AddUserInput extends OmitType(User, [
  'checkPassword',
  'createdAt',
  'updatedAt',
  'hashPassword',
  'matKhau',
  'vaiTroNguoiDung',
]) {}

@ObjectType()
export class AddUserOutput extends CoreOutput {}

@InputType()
export class EditUserInput {
  @Field(() => ID)
  nguoiYeuCauId: number;

  @Field()
  ten?: string;

  @Field()
  gioiTinh?: string;

  @Field({ nullable: true })
  biDanh?: string;

  @Field(() => Date)
  ngaySinh?: Date;

  @Field()
  noiSinh?: string;

  @Field()
  queQuan?: string;

  @Field({ nullable: true })
  noiThuongTruTruocDo?: string;

  @Field({ nullable: true })
  ngayDangKiThuongTru?: Date;

  @Field({ nullable: true })
  ngheNghiep?: string;

  @Field({ nullable: true })
  noiLamViec?: string;

  @Field()
  danToc?: string;

  @Field()
  lyDoThayDoi: string;
}

@ObjectType()
export class EditUserOutput extends CoreOutput {}

@ObjectType()
export class XemThongTinNguoiDungOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}

@InputType()
export class XemThongTinNguoiDungChoQuanLiInput {
  @Field(() => ID)
  userId: number;
}
