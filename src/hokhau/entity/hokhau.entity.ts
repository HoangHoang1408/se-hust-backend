import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { LichSuHoKhau } from './lichsuhokhau.entity';

@InputType('HoKhauInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class HoKhau extends CoreEntity {
  @Field()
  @Column()
  soHoKhau: string;

  @Field()
  @Column()
  diaChiThuongTru: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ghiChu?: string;

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.hoKhau)
  thanhVien: User[];

  @Field(() => [LichSuHoKhau])
  @OneToMany(() => LichSuHoKhau, (lichsuhokhau) => lichsuhokhau.hoKhau)
  lichSuHoKhau: LichSuHoKhau[];
}
