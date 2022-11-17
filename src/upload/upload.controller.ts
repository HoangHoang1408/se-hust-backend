import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  DeleteFileInput,
  DeleteFilesInput,
  UploadInput,
} from './dto/UploadFile.dto';
import { UploadService } from './upload.service';

@Controller('')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('upload/file')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() { storagePath }: UploadInput,
  ) {
    return this.uploadService.uploadFile(file, storagePath);
  }

  @Post('upload/files')
  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(201)
  uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() { storagePath }: UploadInput,
  ) {
    return this.uploadService.uploadFiles(files, storagePath);
  }

  @Post('delete/file')
  @HttpCode(204)
  deleteFile(@Body() input: DeleteFileInput) {
    return this.uploadService.deleteFile(input);
  }

  @Post('delete/files')
  @HttpCode(204)
  deleteFiles(@Body() input: DeleteFilesInput) {
    return this.uploadService.deleteFiles(input);
  }
}
