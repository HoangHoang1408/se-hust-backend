import { Field, ID, InputType, ObjectType, OmitType, PartialType, PickType } from '@nestjs/graphql';
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
export class EditUserInput extends PartialType(PickType(User,['ten', 'gioiTinh', 'biDanh', 'ngaySinh', 'noiSinh', 'queQuan', 'noiThuongTruTruocDo', 'ngayDangKiThuongTru', 'ngheNghiep', 'noiLamViec', 'danToc', 'ghiChu'])) {
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
