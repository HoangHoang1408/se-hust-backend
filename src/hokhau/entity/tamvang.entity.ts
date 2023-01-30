import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@InputType('TamVangInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class TamVang extends CoreEntity {
  @Field(() => User)
  @ManyToOne(() => User)
  nguoiPheDuyet: User;

  @Field(() => User)
  @ManyToOne(() => User)
  nguoiTamVang: User;

  @Field(() => Date, { nullable: true })
  @Column('timestamp without time zone', { nullable: true })
  ngayBatDauTamVang?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lyDoTamVang?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  diaChiNoiDen?: string;

  @Field(() => Date, { nullable: true })
  @Column('timestamp without time zone', { nullable: true })
  ngayHetHieuLuc?: Date;
}
