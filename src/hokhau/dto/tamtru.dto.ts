import { User } from 'src/user/entities/user.entity';
import { Field, ID, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import {
  CoreOutput,
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/output.dto';
import { TamTru } from '../entity/tamtru.entity';

@InputType()
export class AddTamTruInput {
  @Field(() => ID)
  nguoiTamTruId: number;
  @Field()
  noiTamTruHienTai: string;
}
@ObjectType()
export class AddTamTruOutput extends CoreOutput {}
@InputType()
export class XemDanhSachTamTruInput {
  @Field(() => PaginationInput)
  paginationInput: PaginationInput;

  @Field({ nullable: true })
  canCuocCongDan: string;
}

@ObjectType()
export class XemDanhSachTamTruOutput extends CoreOutput {
  @Field(() => PaginationOutput, { nullable: true })
  paginationOutput?: PaginationOutput;

  @Field(() => [TamTru], { nullable: true })
  tamTru?: TamTru[];
}

@InputType()
export class SuaThongTinTamTruInput extends CoreOutput {
  @Field(() => ID)
  nguoiYeuCauId: number;

  @Field()
  noiTamTruMoi: string;
}
@ObjectType()
export class SuaThongTinTamTruOutput extends CoreOutput {}

@InputType()
export class HetTamTruInput extends CoreOutput {
  @Field(() => ID)
  nguoiYeuCauId: number;
}
@ObjectType()
export class HetTamTruOutput extends CoreOutput {}

@ObjectType()
export class XemThongTinTamTruOutput extends CoreOutput {
  @Field(() => TamTru, { nullable: true })
  tamTru?: TamTru;
}
