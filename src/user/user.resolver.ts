import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/role.decorator';
import { CurrentUser } from 'src/auth/user.decorator';
import {
  AddUserInput,
  AddUserOutput,
  UserDetailInput,
  UserDetailOutput,
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

  @Query(() => UserDetailOutput)
  @Roles(['Any'])
  getUserDetail(@CurrentUser() user, @Args('input') input: UserDetailInput) {
    return this.userService.getUserDetail(user, input);
  }
}
