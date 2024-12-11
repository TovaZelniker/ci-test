import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseService } from '../services/base.service';
import { CreateDocumentationDto } from './dto/create-documentation.dto';
import { Documentation } from './schemas/documentation.schema';
import { UpdateDocumentationDto } from './dto/update-documentation.dto';


@Injectable()
export class DocumentationService extends BaseService<Documentation, CreateDocumentationDto, UpdateDocumentationDto> {

  constructor(@InjectModel(Documentation.name) private documentationModel: Model<Documentation>) {
    super(documentationModel);
  }

}
