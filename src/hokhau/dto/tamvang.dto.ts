import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import {
  CoreOutput,
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/output.dto';
import { TamVang } from '../entity/tamvang.entity';

@InputType()
export class AddTamVangInput {
  @Field(() => ID)
  nguoiTamVangId: number;
  @Field()
  lyDoTamVang: string;
  @Field()
  diaChiNoiDen: string;
}
@ObjectType()
export class AddTamVangOutput extends CoreOutput {}

@InputType()
export class XemDanhSachTamVangInput {
  @Field(() => PaginationInput)
  paginationInput: PaginationInput;

  @Field({ nullable: true })
  canCuocCongDan: string;
}

@ObjectType()
export class XemDanhSachTamVangOutput extends CoreOutput {
  @Field(() => PaginationOutput, { nullable: true })
  paginationOutput?: PaginationOutput;

  @Field(() => [TamVang], { nullable: true })
  tamVang?: TamVang[];
}

@InputType()
export class SuaThongTinTamVangInput {
  @Field(() => ID)
  nguoiYeuCauId: number;
  @Field()
  lyDoTamVang: string;
  @Field()
  diaChiNoiDenMoi: string;
}

@ObjectType()
export class SuaThongTinTamVangOutput extends CoreOutput {}

@InputType()
export class HetTamVangInput {
  @Field(() => ID)
  nguoiYeuCauId: number;
}

@ObjectType()
export class HetTamVangOutput extends CoreOutput {}

@ObjectType()
export class XemThongTinTamVangOutput extends CoreOutput {
  @Field(() => TamVang, { nullable: true })
  tamVang?: TamVang;
}
