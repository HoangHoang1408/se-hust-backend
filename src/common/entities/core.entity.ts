import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

@ObjectType({ isAbstract: true })
@Entity()
export abstract class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
