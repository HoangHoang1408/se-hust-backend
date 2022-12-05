import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/role.decorator';
import { CurrentUser } from 'src/auth/user.decorator';
import { User } from 'src/user/entities/user.entity';
import {
  DangKyTamVangInput,
  DangKyTamVangOutput,
  TachHoKhauInput,
  TachHoKhauOutput,
  ThayDoiChuHoInput,
  ThayDoiChuHoOutput,
  ThemHoKhauInput,
  ThemHoKhauOutput,
  ThemNguoiVaoHoKhauInput,
  ThemNguoiVaoHoKhauOutput,
  XemHoKhauChiTietChoQuanLiInput,
  XemHoKhauChiTietChoQuanLiOutput,

  XoaDangKyTamVangInput,
  XoaDangKyTamVangOutput,

  XemLichSuThayDoiNhanKhauInput,
  XemLichSuThayDoiNhanKhauOutput,
  XoaNguoiKhoiHoKhauInput,
  XoaNguoiKhoiHoKhauOutput,
} from './dto/hokhau.dto';
import { HokhauService } from './hokhau.service';
@Resolver()
export class HokhauResolver {
  constructor(private readonly hoKhauService: HokhauService) {}

  @Query(() => XemHoKhauChiTietChoQuanLiOutput)
  @Roles(['ToTruong', 'ToPho'])
  xemHoKhauChiTietChoQuanLi(
    @Args('input') input: XemHoKhauChiTietChoQuanLiInput,
  ) {
    return this.hoKhauService.xemHoKhauChiTietChoQuanLi(input);
  }

  @Query(() => XemHoKhauChiTietChoQuanLiOutput)
  @Roles(['Any'])
  xemHoKhauChiTietChoNguoiDung(@CurrentUser() user: User) {
    return this.hoKhauService.xemHoKhauChiTietChoNguoiDung(user);
  }

  @Mutation(() => ThemHoKhauOutput)
  @Roles(['ToTruong', 'ToPho'])
  themHoKhau(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: ThemHoKhauInput,
  ) {
    return this.hoKhauService.themHoKhau(nguoiPheDuyet, input);
  }

  @Mutation(() => TachHoKhauOutput)
  @Roles(['ToTruong', 'ToPho'])
  tachHoKhau(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: TachHoKhauInput,
  ) {
    return this.hoKhauService.tachHoKhau(nguoiPheDuyet, input);
  }
  @Mutation(() => ThemNguoiVaoHoKhauOutput)
  @Roles(['ToTruong', 'ToPho'])
  themNguoiVaoHoKhau(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: ThemNguoiVaoHoKhauInput,
  ) {
    return this.hoKhauService.themNguoiVaoHoKhau(nguoiPheDuyet, input);
  }

  @Mutation(() => ThayDoiChuHoOutput)
  @Roles(['ToTruong', 'ToPho'])
  thayDoiChuHo(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: ThayDoiChuHoInput,
  ) {
    return this.hoKhauService.thayDoiChuHo(nguoiPheDuyet, input);
  }
  @Mutation(() => DangKyTamVangOutput)
  @Roles(['ToTruong', 'ToPho'])
  dangKyTamVang(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: DangKyTamVangInput,
  ) {
    return this.hoKhauService.dangKyTamVang(nguoiPheDuyet, input);
  }
  @Mutation(() => XoaDangKyTamVangOutput)
  @Roles(['ToTruong', 'ToPho'])
  xoaDangKyTamVang(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: XoaDangKyTamVangInput,
  ) {
    return this.hoKhauService.xoaDangKyTamVang(nguoiPheDuyet, input);


  @Mutation(() => XoaNguoiKhoiHoKhauOutput)
  @Roles(['ToTruong', 'ToPho'])
  xoaNguoiKhoiHoKhau(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: XoaNguoiKhoiHoKhauInput,
  ) {
    return this.hoKhauService.xoaNguoiKhoiHoKhau(nguoiPheDuyet, input);
  }

  @Query(() => XemLichSuThayDoiNhanKhauOutput)
  @Roles(['ToTruong', 'ToPho'])
  xemLichSuThayDoiNhanKhau(
    @Args('input') input: XemLichSuThayDoiNhanKhauInput,
  ) {
    return this.hoKhauService.xemLichSuThayDoiNhanKhau(input);

  }
}
