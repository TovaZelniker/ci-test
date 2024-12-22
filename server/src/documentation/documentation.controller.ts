import { Body, Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';

import { BaseController } from '../controllers/base.controller';
import { CreateDocumentationDto } from './dto/create-documentation.dto';
import { Documentation } from './schemas/documentation.schema';
import { DocumentationService } from './documentation.service';
import { DocumentationValidationPipe } from './pipes/documentation-validation.pipe';
import { File } from '../services/minio-client/file.model';
import { UpdateDocumentationDto } from './dto/update-documentation.dto';


@Controller('documentation')
export class DocumentationController extends BaseController<Documentation, CreateDocumentationDto, UpdateDocumentationDto> {
  
  constructor(private readonly documentationService: DocumentationService) {
    super(documentationService);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body(DocumentationValidationPipe) data: CreateDocumentationDto, @UploadedFile() file?: File) {
    return this.documentationService.create(data, file);
  }

  @Delete(':id')
  async delete(@Param('id') id: Types.ObjectId) {
    return this.documentationService.delete(id);
  }

}
