import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { VaiTroThanhVien } from 'src/user/entities/user.entity';
import { HoKhau } from '../entity/hokhau.entity';
import { LichSuHoKhau } from '../entity/lichsuhokhau.entity';

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
export class TachHoKhauOutput extends CoreOutput {}

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
export class ThemNguoiVaoHoKhauOutput extends CoreOutput {}

@ObjectType()
export class ThemHoKhauOutput extends CoreOutput {}

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
export class XoaNguoiKhoiHoKhauInput {
  @Field(() => ID)
  nguoiYeuCauId: number;

  @Field(() => ID)
  nguoiCanXoaId: number;

  @Field(() => ID)
  hoKhauId: number;
}
@ObjectType()
export class XoaNguoiKhoiHoKhauOutput extends CoreOutput {}

@InputType()
export class XemLichSuThayDoiNhanKhauInput {
  @Field(() => ID)
  hoKhauId: number;
}

@ObjectType()
export class XemLichSuThayDoiNhanKhauOutput extends CoreOutput {
  @Field(() => LichSuHoKhau, { nullable: true })
  lichSuHoKhau?: LichSuHoKhau;
}
