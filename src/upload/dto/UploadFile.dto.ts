import { IsString } from 'class-validator';

export class UploadInput {
  @IsString()
  storagePath: string;
}
export class DeleteFileInput {
  @IsString()
  storagePath: string;
}
export class DeleteFilesInput {
  @IsString({ each: true })
  storagePaths: string[];
}
