import {
  Field,
  InputType,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class AddUserInput extends OmitType(User, [
  'checkPassword',
  'createdAt',
  'updatedAt',
  'hashPassword',
  'matKhau',
  'vaiTro',
]) {}

@ObjectType()
export class AddUserOutput extends CoreOutput {}

@InputType()
export class UserDetailInput extends PickType(User, ['id']) {}

@ObjectType()
export class UserDetailOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
