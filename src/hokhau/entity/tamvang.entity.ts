import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@InputType('TamVangInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class TamVang extends CoreEntity {
  @ManyToOne(() => User)
  @JoinColumn()
  nguoiPheDuyet: User;

  @OneToOne(() => User)
  @JoinColumn()
  nguoiTamVang: User;

  @Field(() => Date)
  @Column({ nullable: true })
  ngayBatDauTamVang?: Date;

  @Field()
  @Column()
  lyDoTamVang?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  diaChiNoiDen?: string;
}
