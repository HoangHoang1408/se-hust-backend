import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { HoKhau } from './entity/hokhau.entity';
import { LichSuHoKhau } from './entity/lichsuhokhau.entity';
import { TamTru } from './entity/tamtru.entity';
import { TamVang } from './entity/tamvang.entity';
import { HokhauResolver } from './resolver/hokhau.resolver';
import { TamTruResolver } from './resolver/tamtru.resolver';
import { HokhauService } from './service/hokhau.service';
import { TamTruService } from './service/tamtru.service';
import { TamVangService } from './service/tamvang.service';

@Module({
  providers: [HokhauService, HokhauResolver, TamTruResolver, TamTruService,TamVangService],
  imports: [TypeOrmModule.forFeature([HoKhau, User, LichSuHoKhau, TamTru,TamVang])],
})
export class HokhauModule { }
