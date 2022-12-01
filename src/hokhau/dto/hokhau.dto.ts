import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { VaiTroThanhVien } from 'src/user/entities/user.entity';
import { HoKhau } from '../entity/hokhau.entity';

@InputType()
class ThanhVien {
  @Field(() => ID)
  id: number;

  @Field(() => VaiTroThanhVien)
  vaiTroThanhVien: VaiTroThanhVien;
}

@InputType()
export class TachHoKhauInput {
  @Field(() => ID)
  nguoiYeuCauId: number;

  @Field(() => ID)
  hoKhauId: number;

  @Field(() => [ThanhVien])
  thanhVienHoKhauMoi: ThanhVien[];

  @Field()
  diaChiThuongTruMoi: string;
}

@ObjectType()
export class TachHoKhauOutput extends CoreOutput { }

@InputType()
export class ThemHoKhauInput {
  @Field(() => ID)
  nguoiYeuCauId: number;

  @Field()
  diaChiThuongTru: string;

  @Field(() => [ThanhVien])
  thanhVien: ThanhVien[];
}
@InputType()
export class ThemNguoiVaoHoKhauInput {
  @Field(() => ID)
  nguoiYeuCauId: number;

  @Field(() => ThanhVien)
  nguoiMoi: ThanhVien;

  @Field(() => ID)
  hoKhauId: number;

}

@ObjectType()
export class ThemNguoiVaoHoKhauOutput extends CoreOutput { }

@ObjectType()
export class ThemHoKhauOutput extends CoreOutput { }

@InputType()
export class XemHoKhauChiTietChoQuanLiInput {
  @Field(() => ID)
  hoKhauId: number;
}
@ObjectType()
export class XemHoKhauChiTietChoQuanLiOutput extends CoreOutput {
  @Field(() => HoKhau, { nullable: true })
  hoKhau?: HoKhau;
}
@InputType()
export class ThayDoiChuHoInput {
  @Field(() => ID)
  nguoiYeuCauId: number;

  @Field(() => ID)
  hoKhauId: number;

  @Field(() => [ThanhVien])
  thayDoiVaiTroThanhVien: ThanhVien[];
}
@ObjectType()
export class ThayDoiChuHoOutput extends CoreOutput {}

@InputType()
export class DangKyTamVangInput{
  @Field(() => ID)
  nguoiYeuCauId:number;
}
@ObjectType()
export class DangKyTamVangOutput extends CoreOutput {}
@InputType()
export class XoaDangKyTamVangInput {
  @Field(() => ID)
  nguoiYeuCauId: number;
}
@ObjectType()
export class XoaDangKyTamVangOutput extends CoreOutput {}