import { Field, ID, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
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
// export class xemThongTinTamTruInput {
//   @Field(() => ID)
//   nguoiTamTruId: number;

// }
@ObjectType()
export class xemThongTinTamTruOutput extends CoreOutput {
  @Field(() => TamTru, { nullable: true })
  tamtru?: TamTru;
}
