import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoKhau } from 'src/hokhau/entity/hokhau.entity';
import { TamTru } from 'src/hokhau/entity/tamtru.entity';
import { TamVang } from 'src/hokhau/entity/tamvang.entity';
import { User } from 'src/user/entities/user.entity';
import { DongGop } from './entities/donggop.entity';
import { KhoanPhi } from './entities/khoanphi.entity';
import { DongGopResolver } from './resolvers/donggop.resolver';
import { KhoanPhiResolver } from './resolvers/khoanphi.resolver';
import { DongGopService } from './services/donggop.service';
import { KhoanPhiService } from './services/khoanphi.service';

@Module({
  imports: [TypeOrmModule.forFeature([KhoanPhi, HoKhau, TamTru, DongGop,TamVang,User])],
  providers: [
    KhoanPhiResolver,
    KhoanPhiService,
    DongGopResolver,
    DongGopService,
  ],
})
export class KhoanPhiModule {}
