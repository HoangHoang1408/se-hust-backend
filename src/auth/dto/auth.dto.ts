import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from 'src/user/entities/user.entity';

@InputType()
export class RegisterUserInput extends PickType(User, [
  'canCuocCongDan',
  'matKhau',
]) {
  @Field()
  matKhauLapLai: string;
}

@ObjectType()
export class RegisterUserOutput extends CoreOutput {}

@InputType()
export class LoginInput extends PickType(User, ['canCuocCongDan']) {
  @Field()
  matKhau: string;
}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field({ nullable: true })
  accessToken?: string;
}

@InputType()
export class NewAccessTokenInput {
  @Field()
  accessToken: string;
}

@ObjectType()
export class NewAccessTokenOutput extends CoreOutput {
  @Field({ nullable: true })
  accessToken?: string;
}
