import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { DongGop } from './donggop.entity';

enum KieuPhi {
  TuNguyen = 'Tự nguyện',
  BatBuoc = 'Bắt buộc',
}
registerEnumType(KieuPhi, { name: 'KieuPhi' });

@InputType('LoaiPhiInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class LoaiPhi extends CoreEntity {
  @Field()
  @Column()
  ten: string;

  @Field(() => Date)
  @Column('timestamp without time zone')
  ngayPhatDong: Date;

  @Field(() => KieuPhi)
  @Column({ type: 'enum', enum: KieuPhi })
  kieuPhi: KieuPhi;

  @Field()
  @Column()
  theoNhanKhau: boolean;

  @Field()
  @Column()
  soTien: number;

  @Field(() => [DongGop], { nullable: true })
  @OneToMany(() => DongGop, (donggop) => donggop.loaiPhi, { nullable: true })
  dongGop?: DongGop[];
}
