import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/role.decorator';
import { CurrentUser } from 'src/auth/user.decorator';
import { User } from 'src/user/entities/user.entity';
import {
  AddDongGopInput,
  AddDongGopOutput,
  EditDongGopInput,
  EditDongGopOutput,
  xemDanhSachDongGopChoNguoiDungOutput,
  xemDanhSachDongGopChoNguoiQuanLiInput,
  xemDanhSachDongGopChoNguoiQuanLiOutput,
} from '../dtos/donggop.dto';
import { DongGop } from '../entities/donggop.entity';
import { DongGopService } from '../services/donggop.service';

@Resolver(() => DongGop)
export class DongGopResolver {
  constructor(private readonly DongGopService: DongGopService) {}

  @Mutation(() => AddDongGopOutput)
  @Roles(['KeToan'])
  async addDongGop(@Args('input') input: AddDongGopInput) {
    return this.DongGopService.addDongGop(input);
  }

  @Mutation(() => EditDongGopOutput)
  @Roles(['KeToan'])
  async EditDongGop(@Args('input') input: EditDongGopInput) {
    return this.DongGopService.editDongGop(input);
  }

  @Query(() => xemDanhSachDongGopChoNguoiQuanLiOutput)
  @Roles(['KeToan'])
  xemDanhSachDongGopChoNguoiQuanLi(
    @Args('input') input: xemDanhSachDongGopChoNguoiQuanLiInput,
  ) {
    return this.DongGopService.xemDanhSachDongGopChoNguoiQuanLi(input);
  }
  @Query(() => xemDanhSachDongGopChoNguoiDungOutput)
  @Roles(['Any'])
  xemDanhSachDongGopChoNguoiDung(
    @CurrentUser() nguoiHienTai: User,
  ) {
    return this.DongGopService.xemDanhSachDongGopChoNguoiDung(nguoiHienTai);
  }
}
