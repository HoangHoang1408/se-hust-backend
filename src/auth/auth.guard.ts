import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'jsonwebtoken';
import { ACCESS_TOKEN } from 'src/common/constants/constants';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AllowedRole } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const roles = this.reflector.get<AllowedRole[]>(
        'roles',
        context.getHandler(),
      );
      if (!roles) return true;
      const gqlContext = GqlExecutionContext.create(context).getContext();
      const decoded = verify(
        gqlContext[ACCESS_TOKEN],
        this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      );
      if (!decoded || !decoded['userId']) return false;
      const user = await this.userRepo.findOneBy({
        id: +decoded['userId'],
      });
      if (
        !user ||
        (!roles.includes(user.vaiTroNguoiDung) && !roles.includes('Any'))
      )
        return false;
      gqlContext['user'] = user;
      return true;
    } catch {
      return false;
    }
  }
}
