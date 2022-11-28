import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/role.decorator';
import { CurrentUser } from 'src/auth/user.decorator';
import {
  AddTamTruInput,
  AddTamTruOutput,
  AddUserInput,
  AddUserOutput,
  XemThongTinNguoiDungChoQuanLiInput,
  XemThongTinNguoiDungOutput,
} from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Mutation(() => AddUserOutput)
  @Roles(['ToTruong', 'ToPho'])
  addUser(@Args('input') input: AddUserInput) {
    return this.userService.addUser(input);
  }

  @Mutation(() => AddTamTruOutput)
  @Roles(['ToTruong', 'ToPho'])
  async addTamTru(@CurrentUser() nguoiPheDuyet: User,
    @Args('input') input: AddTamTruInput,) {
    return this.userService.addTamTru(nguoiPheDuyet, input);
  }

  @Query(() => XemThongTinNguoiDungOutput)
  @Roles(['Any'])
  xemThongTinNguoiDung(@CurrentUser() user: User) {
    return this.userService.xemThongTinNguoiDung(user);
  }

  @Query(() => XemThongTinNguoiDungOutput)
  @Roles(['ToTruong', 'ToPho'])
  xemThongTinNguoiDungChoQuanLi(
    @Args('input') input: XemThongTinNguoiDungChoQuanLiInput,
  ) {
    return this.userService.xemThongTinNguoiDungChoQuanLi(input);
  }
}
