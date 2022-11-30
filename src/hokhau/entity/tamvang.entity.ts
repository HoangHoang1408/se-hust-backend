
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "../../user/entities/user.entity";


@InputType('TamVangInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class TamVang extends CoreEntity {
    @OneToOne(() => User)
    @JoinColumn()
    nguoiPheDuyet: User;

    @OneToOne(() => User)
    @JoinColumn()
    userTamVang: User;
   
    @Field(()=>Date)
    @Column({ nullable: true })
    ngayBatDauTamVang:Date;

    @Field()
    @Column()
    lyDoTamVang?: string;
     
    @Field({ nullable: true })
    @Column({ nullable: true })
    diaChiNoiDen: string;
}