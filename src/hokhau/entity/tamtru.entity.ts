import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@InputType('TamTruInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class TamTru extends CoreEntity {
  @Field(() => User)
  @ManyToOne(() => User)
  nguoiPheDuyet: User;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  nguoiTamTru: User;

  @Field(() => Date)
  @Column('timestamp without time zone', { nullable: true })
  ngayHetHanTamTru?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ghiChu?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  noiTamTruHienTai?: string;
}
