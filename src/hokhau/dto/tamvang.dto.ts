import { Field, ID, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput, PaginationInput, PaginationOutput } from 'src/common/dto/output.dto';
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
export class xemDanhSachTamVangInput {
  @Field(() => PaginationInput)
  paginationInput: PaginationInput;

  @Field({ nullable: true })
  canCuocCongDan: string;
}

@ObjectType()
export class xemDanhSachTamVangOutput extends CoreOutput {
  @Field(() => PaginationOutput, { nullable: true })
  paginationOutput?: PaginationOutput;

  @Field(() => TamVang, { nullable: true })
  tamVang?: TamVang[];
}

@InputType()
export class suaThongTinTamVangInput {
  @Field(() => ID)
  nguoiYeuCauId: number;
  @Field(() => ID)
  bangTamVangId: number;
  @Field()
  lyDoTamVang: string;
  @Field()
  diaChiNoiDenMoi: string;
}

@ObjectType()
export class suaThongTinTamVangOutput extends CoreOutput {}
