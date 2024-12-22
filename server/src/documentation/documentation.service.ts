import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { BaseService } from '../services/base/base.service';
import { CreateDocumentationDto } from './dto/create-documentation.dto';
import { Documentation, DocumentationDocument } from './schemas/documentation.schema';
import { File } from '../services/minio-client/file.model';
import { MinioClientService } from '../services/minio-client/minio-client.service';
import { UpdateDocumentationDto } from './dto/update-documentation.dto';


@Injectable()
export class DocumentationService extends BaseService<DocumentationDocument, CreateDocumentationDto, UpdateDocumentationDto> {

  constructor(
    @InjectModel(Documentation.name) private documentationModel: Model<DocumentationDocument>,
    private minioClientService: MinioClientService) {
    super(documentationModel);
  }

  async create(documentationDto: CreateDocumentationDto, file?: File): Promise<DocumentationDocument> {
    const documentationData: Partial<CreateDocumentationDto & { fileName?: string }> = { ...documentationDto };
    try {
      if (file) {
        documentationData.content = file.originalname;
        documentationData.fileName = await this.uploadFile(file, documentationData.productId.toString());
      }
      return await super.create(documentationData as CreateDocumentationDto);
    } catch (error){
      if(documentationData.fileName){
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.deleteFile(documentationData.fileName, documentationData.productId.toString());
      }
      throw error;
    }
  }
  
  async delete(id: Types.ObjectId): Promise<DocumentationDocument> {
    let deletedRow: DocumentationDocument;
    try {
      const documentation = await this.findOne(id);
      this.checkIsDocumentationFile(documentation);
      deletedRow = await super.delete(id);
      await this.deleteFile(documentation.fileName, documentation.productId.toString());
      return deletedRow;
    }
    catch(error){
      if(deletedRow){
        // await super.create(deletedRow);
        await super.create(deletedRow.toObject());
      }
      throw error;
    }
  }

  checkIsDocumentationFile(documentation: Documentation){
    if (!documentation.fileName){
      throw new BadRequestException('Deleting documentation is enabled for files only.');
    }
  }

  async uploadFile(file: File, bucketName: string) {
    return await this.minioClientService.upload(file, bucketName);
  }

  async deleteFile(fileName: string, bucketName: string) {
    return await this.minioClientService.delete(fileName, bucketName);
  }

}
