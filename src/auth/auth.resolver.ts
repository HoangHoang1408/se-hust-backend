import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import {
  LoginInput,
  LoginOutput,
  NewAccessTokenInput,
  NewAccessTokenOutput,
  RegisterUserInput,
  RegisterUserOutput,
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dto/auth.dto';
import { Roles } from './role.decorator';
import { CurrentUser } from './user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterUserOutput)
  registerUser(@Args('input') input: RegisterUserInput) {
    return this.authService.registerUser(input);
  }

  @Query(() => LoginOutput)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Query(() => NewAccessTokenOutput)
  newAccessToken(@Args('input') input: NewAccessTokenInput) {
    return this.authService.newAccessToken(input);
  }

  @Mutation(() => ChangePasswordOutput)
  @Roles(['Any'])
  changePassword(
    @CurrentUser() user: User,
    @Args('input') input: ChangePasswordInput,
  ) {
    return this.authService.changePassword(user, input);
  }
}
