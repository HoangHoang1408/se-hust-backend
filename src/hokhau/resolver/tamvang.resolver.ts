import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/role.decorator';
import { CurrentUser } from 'src/auth/user.decorator';
import { User } from 'src/user/entities/user.entity';
import {
  AddTamVangInput,
  AddTamVangOutput,
  suaThongTinTamVangOutput,
  suaThongTinTamVangInput,
  xemThongTinTamVangOutput,
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

  @Query(() => xemThongTinTamVangOutput)
  @Roles(['Any'])
  xemThongTinTamVang(@CurrentUser() user: User) {
    return this.tamVangService.xemThongTinTamVang(user);
  }

  @Mutation(() => suaThongTinTamVangOutput)
  @Roles(['ToTruong', 'ToPho'])
  async suaThongTinTamVang(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: suaThongTinTamVangInput,
  ) {
    return this.tamVangService.suaThongTinTamVang(nguoiPheDuyet, input);
  }
}
