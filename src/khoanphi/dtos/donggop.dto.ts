import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  CoreOutput,
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/output.dto';
import { User } from 'src/user/entities/user.entity';
import { DongGop } from '../entities/donggop.entity';
import { LoaiPhi } from '../entities/khoanphi.entity';

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
  ngayNop: Date;
}
@ObjectType()
export class EditDongGopOutput extends CoreOutput {}

@InputType()
export class xemDanhSachDongGopChoNguoiQuanLiInput {
  @Field(() => PaginationInput)
  paginationInput?: PaginationInput;

  @Field({ nullable: true })
  tenKhoanPhi?: string;

  @Field({ nullable: true })
  sohoKhau?: number;

  @Field({ nullable: true })
  canCuocCongDan?: string;

  @Field(() => LoaiPhi, { nullable: true })
  loaiPhi?: LoaiPhi;

  @Field({ nullable: true })
  trangThai?: boolean;
}

@ObjectType()
export class xemDanhSachDongGopChoNguoiQuanLiOutput extends CoreOutput {
  @Field(() => PaginationOutput, { nullable: true })
  paginationOutput?: PaginationOutput;

  @Field(() => [DongGop], { nullable: true })
  DongGop?: DongGop[];
}
@ObjectType()
export class xemDanhSachDongGopChoNguoiDungOutput extends CoreOutput {
  @Field(() => [DongGop], { nullable: true })
  DongGop?: DongGop[];
}
