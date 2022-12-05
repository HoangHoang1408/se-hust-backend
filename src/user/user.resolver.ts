import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/role.decorator';
import { CurrentUser } from 'src/auth/user.decorator';
import {
  AddUserInput,
  AddUserOutput,
  EditUserInput,
  EditUserOutput,
  XemDanhSachNguoiDungInput,
  XemDanhSachNguoiDungOutput,
  XemThongTinNguoiDungChoQuanLiInput,
  XemThongTinNguoiDungOutput,
} from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => AddUserOutput)
  @Roles(['ToTruong', 'ToPho'])
  addUser(@Args('input') input: AddUserInput) {
    return this.userService.addUser(input);
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

  @Mutation(() => EditUserOutput)
  @Roles(['ToTruong', 'ToPho'])
  editUser(@Args('input') input: EditUserInput) {
    return this.userService.editUser(input);
  }

  @Query(() => XemDanhSachNguoiDungOutput)
  @Roles(['ToTruong', 'ToPho'])
  xemDanhSachNguoiDung(@Args('input') input: XemDanhSachNguoiDungInput) {
    return this.userService.xemDanhSachNguoiDung(input);
  }
}

