import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/role.decorator';
import { CurrentUser } from 'src/auth/user.decorator';
import { User } from 'src/user/entities/user.entity';
import {
  AddTamVangInput,
  AddTamVangOutput,
  HetTamVangInput,
  HetTamVangOutput,
  SuaThongTinTamVangInput,
  SuaThongTinTamVangOutput,
  XemDanhSachTamVangInput,
  XemDanhSachTamVangOutput,
  XemThongTinTamVangOutput,
} from '../dto/tamvang.dto';
import { TamVang } from '../entity/tamvang.entity';
import { TamVangService } from '../service/tamvang.service';

@Resolver(() => TamVang)
export class TamVangResolver {
  constructor(private readonly tamVangService: TamVangService) {}

  @Mutation(() => AddTamVangOutput)
  @Roles(['ToTruong', 'ToPho'])
  async addTamVang(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: AddTamVangInput,
  ) {
    return this.tamVangService.addTamVang(nguoiPheDuyet, input);
  }

  @Mutation(() => SuaThongTinTamVangOutput)
  @Roles(['ToTruong', 'ToPho'])
  async suaThongTinTamVang(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: SuaThongTinTamVangInput,
  ) {
    return this.tamVangService.suaThongTinTamVang(nguoiPheDuyet, input);
  }

  @Query(() => XemDanhSachTamVangOutput)
  @Roles(['ToTruong', 'ToPho'])
  xemDanhSachTamVang(@Args('input') input: XemDanhSachTamVangInput) {
    return this.tamVangService.xemDanhSachTamVang(input);
  }

  @Mutation(() => HetTamVangOutput)
  @Roles(['ToTruong', 'ToPho'])
  async hetTamVang(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: HetTamVangInput,
  ) {
    return this.tamVangService.hetTamVang(nguoiPheDuyet, input);
  }

  @Query(() => XemThongTinTamVangOutput)
  @Roles(['Any'])
  async xemThongTinTamVang(@CurrentUser() user: User) {
    return this.tamVangService.xemThongTinTamVang(user);
  }
}
