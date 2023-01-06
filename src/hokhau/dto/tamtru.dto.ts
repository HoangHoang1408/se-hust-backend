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
export class xemDanhSachTamTruInput {
  @Field(() => PaginationInput)
  paginationInput: PaginationInput;

  @Field({ nullable: true })
  canCuocCongDan: string;
}

@ObjectType()
export class xemDanhSachTamTruOutput extends CoreOutput {
  @Field(() => PaginationOutput, { nullable: true })
  paginationOutput?: PaginationOutput;

  @Field(() => TamTru, { nullable: true })
  tamTru?: TamTru[];
}
