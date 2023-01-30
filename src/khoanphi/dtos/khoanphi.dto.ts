import { Field, ID, InputType, ObjectType, PickType } from '@nestjs/graphql';
import {
  CoreOutput,
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/output.dto';
import { DongGop } from '../entities/donggop.entity';
import { KhoanPhi, LoaiPhi } from '../entities/khoanphi.entity';

@InputType()
export class AddKhoanPhiInput extends PickType(KhoanPhi, [
  'tenKhoanPhi',
  'loaiPhi',
  'theoHoKhau',
  'ngayPhatDong',
  'soTien',
  'ngayHetHan',
]) {}
@ObjectType()
export class AddKhoanPhiOutput extends CoreOutput {}

@InputType()
export class XemKhoanPhiChiTietChoQuanLiInput {
  @Field(() => ID)
  khoanPhiId: number;
}
@ObjectType()
export class XemKhoanPhiChiTietChoQuanLiOutput extends CoreOutput {
  @Field(() => KhoanPhi, { nullable: true })
  khoanphi?: KhoanPhi;
  @Field(() => [DongGop], { nullable: true })
  donggop?: DongGop[];
  @Field()
  tongtien?:number;
  @Field()
  nDaDong?:number;
  @Field()
  nChuaDong?:number;
}
@InputType()
export class xemDanhSachKhoanPhiChoNguoiQuanLiInput {
  @Field(() => PaginationInput)
  paginationInput: PaginationInput;

  @Field({ nullable: true })
  tenKhoanPhi?: string;

  @Field(() => LoaiPhi, { nullable: true })
  loaiPhi?: LoaiPhi;

  @Field({ nullable: true })
  theoHoKhau?: boolean;
}
@ObjectType()
export class xemDanhSachKhoanPhiChoNguoiQuanLiOutput extends CoreOutput {
  @Field(() => PaginationOutput, { nullable: true })
  paginationOutput?: PaginationOutput;

  @Field(() => [KhoanPhi], { nullable: true })
  khoanPhi?: KhoanPhi[];
}
