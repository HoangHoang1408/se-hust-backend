import { Field, ID, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { TamVang } from '../entity/tamvang.entity';


@InputType()
export class AddTamVangInput {
  @Field(() => ID)
  nguoiTamVangId: number;
  @Field()
  lyDoTamVang:string;
  @Field()
  diaChiNoiDen:string;
}
@ObjectType()
export class AddTamVangOutput extends CoreOutput {
}

@ObjectType()
export class xemThongTinTamVangOutput extends CoreOutput {
  @Field(() => TamVang, { nullable: true })
  tamVang?: TamVang;
}

