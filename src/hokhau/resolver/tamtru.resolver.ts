import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/role.decorator';
import { CurrentUser } from 'src/auth/user.decorator';
import { User } from 'src/user/entities/user.entity';
import {
  AddTamTruInput,
  AddTamTruOutput,
  HetTamTruInput,
  HetTamTruOutput,
  SuaThongTinTamTruInput,
  SuaThongTinTamTruOutput,
  XemDanhSachTamTruInput,
  XemDanhSachTamTruOutput,
  XemThongTinTamTruOutput,
} from '../dto/tamtru.dto';
import { TamTru } from '../entity/tamtru.entity';
import { TamTruService } from '../service/tamtru.service';

@Resolver(() => TamTru)
export class TamTruResolver {
  constructor(private readonly tamTruService: TamTruService) {}

  @Mutation(() => AddTamTruOutput)
  @Roles(['ToTruong', 'ToPho'])
  async addTamTru(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: AddTamTruInput,
  ) {
    return this.tamTruService.addTamTru(nguoiPheDuyet, input);
  }
  @Query(() => XemDanhSachTamTruOutput)
  @Roles(['ToPho', 'ToTruong','KeToan'])
  xemDanhSachTamTru(@Args('input') input: XemDanhSachTamTruInput) {
    return this.tamTruService.xemDanhSachTamTru(input);
  }
  @Mutation(() => SuaThongTinTamTruOutput)
  @Roles(['ToTruong', 'ToPho'])
  async suaThongTinTamTru(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: SuaThongTinTamTruInput,
  ) {
    return this.tamTruService.suaThongTinTamTru(nguoiPheDuyet, input);
  }
  @Mutation(() => HetTamTruOutput)
  @Roles(['ToTruong', 'ToPho'])
  async hetTamTru(
    @CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: HetTamTruInput,
  ) {
    return this.tamTruService.hetTamTru(nguoiPheDuyet, input);
  }
  @Query(() => XemThongTinTamTruOutput)
  @Roles(['Any'])
  xemThongTinTamTru(
    @CurrentUser() user: User
  ){
    return this.tamTruService.xemThongTinTamTru(user);
  }
}
