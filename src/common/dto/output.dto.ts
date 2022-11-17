import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@ObjectType()
class CustomError {
  @Field()
  mainReason: string;

  @Field()
  message: string;
}

@ObjectType()
export class CoreOutput {
  @Field()
  ok: boolean;

  @Field(() => CustomError, { nullable: true })
  error?: CustomError;
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsInt()
  resultsPerPage: number;
}

@ObjectType()
export class PaginationOutput {
  @Field(() => Int, { nullable: true })
  totalPages?: number;

  @Field(() => Int, { nullable: true })
  totalResults?: number;
}
