import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@InputType('TamVangInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class TamVang extends CoreEntity {
  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn()
  nguoiPheDuyet: User;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  nguoiTamVang: User;


  @Field(() => Date, { nullable: true })
  @Column('timestamp without time zone', { nullable: true })
  ngayBatDauTamVang?: Date;

  @Field()
  @Column()
  lyDoTamVang?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  diaChiNoiDen?: string;


  @Field(() => Date, { nullable: true })
  @Column('timestamp without time zone', { nullable: true })
  ngayHetHieuLuc?: Date;
}
