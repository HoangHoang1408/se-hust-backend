import { Module } from '@nestjs/common';
import { ThuchiResolver } from './thuchi.resolver';
import { ThuchiService } from './thuchi.service';

@Module({
  providers: [ThuchiResolver, ThuchiService]
})
export class ThuchiModule {}
