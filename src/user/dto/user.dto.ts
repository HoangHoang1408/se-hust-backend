import { Field, ID, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { TamTru } from '../entities/tamtru.entity';
import { User } from '../entities/user.entity';

@InputType()
export class AddUserInput extends OmitType(User, [
  'checkPassword',
  'createdAt',
  'updatedAt',
  'hashPassword',
  'matKhau',
  'vaiTroNguoiDung',
]) { }
@InputType()
export class AddTamTruInput {
  @Field(() => ID)
  nguoiTamTruId: number;
  @Field()
  noiTamTruHienTai: string;
}
@ObjectType()
export class AddTamTruOutput extends CoreOutput {
}
@ObjectType()
export class AddUserOutput extends CoreOutput { }

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
