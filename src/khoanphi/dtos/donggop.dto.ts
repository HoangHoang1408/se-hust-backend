import { Field, ID, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import {
  CoreOutput,
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/output.dto';
import { HoKhau } from 'src/hokhau/entity/hokhau.entity';
import { User } from 'src/user/entities/user.entity';
import { DongGop } from '../entities/donggop.entity';
import { KhoanPhi } from '../entities/khoanphi.entity';

@InputType()
export class AddDongGopInput {
  @Field()
  KhoanPhiId: number;
  @Field()
  soTienDongGop: number;

  @Field({ nullable: true })
  nguoiTamTruId?: number;

  @Field({ nullable: true })
  hoKhauId?: number;
}
@ObjectType()
export class AddDongGopOutput extends CoreOutput {}

@InputType()
export class EditDongGopInput {
  @Field()
  dongGopId: number;

  @Field()
  soTienDongGop: number;

  @Field()
  ngayNop: string;
}
@ObjectType()
export class EditDongGopOutput extends CoreOutput {}

@InputType()
export class xemDanhSachDongGopChoNguoiQuanLiInput {
  @Field(() => PaginationInput)
  paginationInput: PaginationInput;

  @Field({ nullable: true })
  tenKhoanPhi?: string;

  @Field({ nullable: true })
  sohoKhau?: number;

  @Field({ nullable: true })
  canCuocCongDan?: string;

  @Field({ nullable: true })
  loaiPhi?: string;

  @Field({ nullable: true })
  trangThai?: string;
}
@ObjectType()
export class xemDanhSachDongGopChoNguoiQuanLiOutput extends CoreOutput {
  @Field(() => PaginationOutput, { nullable: true })
  paginationOutput?: PaginationOutput;

  @Field(() => [DongGop], { nullable: true })
  DongGop?: DongGop[];
}
