import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { HoKhau } from 'src/hokhau/entity/hokhau.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { KhoanPhi } from './khoanphi.entity';

@InputType('DongGopInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class DongGop extends CoreEntity {
  @Field()
  @ManyToOne(() => KhoanPhi, (khoanPhi) => khoanPhi.dongGop)
  khoanPhi: KhoanPhi;

  @Field({ nullable: true })
  @ManyToOne(() => User, { nullable: true })
  nguoiTamTru?: User;

  @Field({ nullable: true })
  @ManyToOne(() => HoKhau, { nullable: true })
  hoKhau?: HoKhau;

  @Field()
  @Column()
  trangThai: boolean;

  @Field(() => Date, {nullable:true})
  @Column('timestamp without time zone', { nullable: true })
  ngayNop?: Date;

  @Field()
  @Column()
  soTienDongGop: number;
}
