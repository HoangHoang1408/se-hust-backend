import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/role.decorator';
import { CurrentUser } from 'src/auth/user.decorator';
import { User } from 'src/user/entities/user.entity';
import {
  AddKhoanPhiInput,
  AddKhoanPhiOutput,
  xemDanhSachKhoanPhiChoNguoiQuanLiInput,
  xemDanhSachKhoanPhiChoNguoiQuanLiOutput,
  XemKhoanPhiChiTietChoQuanLiInput,
  XemKhoanPhiChiTietChoQuanLiOutput,
} from '../dtos/khoanphi.dto';
import { KhoanPhi } from '../entities/khoanphi.entity';
import { KhoanPhiService } from '../services/khoanphi.service';

@Resolver(() => KhoanPhi)
export class KhoanPhiResolver {
  constructor(private readonly KhoanPhiService: KhoanPhiService) {}

  @Mutation(() => AddKhoanPhiOutput)
  @Roles(['Any'])
  async addKhoanPhi(
    @CurrentUser() nguoiTao: User,
    @Args('input') input: AddKhoanPhiInput,
  ) {
    return this.KhoanPhiService.addKhoanPhi(nguoiTao, input);
  }
  @Query(() => XemKhoanPhiChiTietChoQuanLiOutput)
  @Roles(['KeToan', 'ToPho', 'ToTruong'])
  xemKhoanPhiChiTietChoNguoiQuanLi(
    @Args('input') input: XemKhoanPhiChiTietChoQuanLiInput,
  ) {
    return this.KhoanPhiService.XemKhoanPhiChiTietChoQuanLi(input);
  }
  @Query(() => xemDanhSachKhoanPhiChoNguoiQuanLiOutput)
  @Roles(['KeToan', 'ToPho', 'ToTruong'])
  XemDanhSachKhoanPhiChoNguoiQuanLi(
    @Args('input') input: xemDanhSachKhoanPhiChoNguoiQuanLiInput,
  ) {
    return this.KhoanPhiService.xemDanhSachKhoanPhiChoNguoiQuanLi(input);
  }
}
