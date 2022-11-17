import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('StoredFileInputType')
@ObjectType()
export class StoredFile {
  @Field()
  fileUrl: string;

  @Field()
  filePath: string;
}
