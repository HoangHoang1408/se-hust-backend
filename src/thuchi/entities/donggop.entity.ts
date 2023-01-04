import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { HoKhau } from 'src/hokhau/entity/hokhau.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { LoaiPhi } from './loaiphi.entity';

@InputType('DongGopInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class DongGop extends CoreEntity {
  @Field()
  @Column()
  soTien: number;

  @Field(() => Date)
  @Column('timestamp without time zone')
  thoiGianNop: Date;

  @Field()
  @Column()
  trangThai: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ghiChu?: string;

  @Field(() => LoaiPhi)
  @ManyToOne(() => LoaiPhi, (loaiphi) => loaiphi.dongGop)
  loaiPhi: LoaiPhi;

  @Field({ nullable: true })
  @ManyToOne(() => HoKhau, { nullable: true })
  hoKhau: HoKhau;

  @Field({ nullable: true })
  @ManyToOne(() => User, { nullable: true })
  nguoiTamTru?: User;
}
