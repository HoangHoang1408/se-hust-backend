import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { DongGop } from './donggop.entity';

export enum LoaiPhi {
  BatBuoc = 'Bắt buộc',
  UngHo = 'Ủng hộ',
}
registerEnumType(LoaiPhi, {
  name: 'LoaiPhi',
});
@InputType('KhoanPhiInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class KhoanPhi extends CoreEntity {
  @ManyToOne(() => User)
  @JoinColumn()
  nguoiTao: User;

  @Field()
  @Column()
  tenKhoanPhi: string;

  @Field(() => [DongGop], { nullable: true })
  @OneToMany(() => DongGop, (dongGop) => dongGop.khoanPhi, { nullable: true })
  dongGop?: DongGop[];

  @Field(() => LoaiPhi)
  @Column('enum', {
    enum: LoaiPhi,
  })
  loaiPhi: string;

  @Field(() => Date)
  @Column('timestamp without time zone')
  ngayPhatDong: Date;

  @Field(() => Date)
  @Column('timestamp without time zone')
  ngayHetHan: Date;

  @Field()
  @Column()
  theoHoKhau: boolean;

  @Field()
  @Column()
  soTien: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ghiChu?: string;
}
