import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/role.decorator';
import { CurrentUser } from 'src/auth/user.decorator';
import { User } from 'src/user/entities/user.entity';
import {
  TachHoKhauInput,
  TachHoKhauOutput,
  ThemHoKhauInput,
  ThemHoKhauOutput,
  ThemNguoiVaoHoKhauInput,
  ThemNguoiVaoHoKhauOutput,
  XemHoKhauChiTietChoQuanLiInput,
  XemHoKhauChiTietChoQuanLiOutput,
} from './dto/hokhau.dto';
import { HokhauService } from './hokhau.service';
@Resolver()
export class HokhauResolver {
  constructor(private readonly hoKhauService: HokhauService) { }

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

}
