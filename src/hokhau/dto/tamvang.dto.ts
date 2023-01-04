import { Field, ID, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { HostedNumberOrderVerificationType } from 'twilio/lib/rest/preview/hosted_numbers/hostedNumberOrder';
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

@ObjectType()
export class xemThongTinTamVangOutput extends CoreOutput {
  @Field(() => TamVang, { nullable: true })
  tamVang?: TamVang;
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
