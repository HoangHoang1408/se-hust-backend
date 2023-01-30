import { HoKhau } from './../hokhau/entity/hokhau.entity';
import { TamVang } from './../hokhau/entity/tamvang.entity';
import { TamTru } from './../hokhau/entity/tamtru.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, TamTru, TamVang, HoKhau])],
  providers: [UserResolver, UserService],
})
export class UserModule {}
