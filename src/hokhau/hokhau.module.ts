import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { HoKhau } from './entity/hokhau.entity';
import { LichSuHoKhau } from './entity/lichsuhokhau.entity';
import { HokhauResolver } from './hokhau.resolver';
import { HokhauService } from './hokhau.service';

@Module({
  providers: [HokhauService, HokhauResolver],
  imports: [TypeOrmModule.forFeature([HoKhau, User, LichSuHoKhau])],
})
export class HokhauModule {}
