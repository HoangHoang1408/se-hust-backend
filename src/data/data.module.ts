import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DataService } from './data.service';

// module với nhiệm vụ generate data vào csdl
@Module({
  providers: [DataService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class DataModule {}
