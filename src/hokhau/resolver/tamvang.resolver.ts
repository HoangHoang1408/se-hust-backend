import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/role.decorator';
import { CurrentUser } from 'src/auth/user.decorator';
import { User } from 'src/user/entities/user.entity';
import {
  AddTamVangInput,
  AddTamVangOutput,
  suaThongTinTamVangOutput,
  suaThongTinTamVangInput,
  xemDanhSachTamVangInput,
  xemDanhSachTamVangOutput,
  hetTamVangOutput,
  hetTamVangInput,
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

  @Mutation(() => suaThongTinTamVangOutput)
  @Roles(['ToTruong', 'ToPho'])
  async suaThongTinTamVang(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: suaThongTinTamVangInput,
  ) {
    return this.tamVangService.suaThongTinTamVang(nguoiPheDuyet, input);
  }

  @Query(() => xemDanhSachTamVangOutput)
  @Roles(['ToTruong', 'ToPho'])
  xemDanhSachTamVang(@Args('input') input: xemDanhSachTamVangInput) {
    return this.tamVangService.xemDanhSachTamVang(input);
  }

  @Mutation(() => hetTamVangOutput)
  @Roles(['ToTruong', 'ToPho'])
  async hetTamVang(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: hetTamVangInput,
  ) {
    return this.tamVangService.hetTamVang(nguoiPheDuyet, input);
  }
}
