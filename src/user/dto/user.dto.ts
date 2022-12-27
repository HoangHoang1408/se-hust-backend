import {
  Field,
  ID,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import {
  CoreOutput,
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class AddUserInput extends OmitType(User, [
  'id',
  'checkPassword',
  'createdAt',
  'updatedAt',
  'hashPassword',
  'matKhau',
  'vaiTroNguoiDung',
  'vaiTroThanhVien',
  'daDangKi',
  'hoKhau',
  'tamTru',
  'ngayDangKiThuongTru',
]) {}

@ObjectType()
export class AddUserOutput extends CoreOutput {}

@InputType()
export class EditUserInput extends PartialType(
  OmitType(User, [
    'checkPassword',
    'createdAt',
    'updatedAt',
    'hashPassword',
    'matKhau',
    'vaiTroNguoiDung',
    'canCuocCongDan',
    'daDangKi',
    'hoKhau',
    'hoKhauId',
    'tamTru',
    'id',
    'vaiTroThanhVien',
  ]),
) {
  @Field(() => ID)
  nguoiYeuCauId: number;
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

@InputType()
export class XemDanhSachNguoiDungInput {
  @Field(() => PaginationInput)
  paginationInput: PaginationInput;

  @Field({ nullable: true })
  hoTen?: string;

  @Field({ nullable: true })
  canCuocCongDan?: string;
}

@ObjectType()
export class XemDanhSachNguoiDungOutput extends CoreOutput {
  @Field(() => PaginationOutput, { nullable: true })
  paginationOutput?: PaginationOutput;

  @Field(() => [User], { nullable: true })
  users?: User[];
}
