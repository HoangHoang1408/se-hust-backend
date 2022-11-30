
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "../../user/entities/user.entity";


@InputType('TamTruInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class TamTru extends CoreEntity {
    @OneToOne(() => User)
    @JoinColumn()
    nguoiPheDuyet: User;

    @OneToOne(() => User)
    @JoinColumn()
    userTamTru: User;

    @Field({ nullable: true })
    @Column({ nullable: true })
    noiTamTruHienTai: string;

}