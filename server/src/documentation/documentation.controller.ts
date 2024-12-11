import { Controller } from '@nestjs/common';

import { BaseController } from '../controllers/base.controller';
import { CreateDocumentationDto } from './dto/create-documentation.dto';
import { Documentation } from './schemas/documentation.schema';
import { DocumentationService } from './documentation.service';
import { UpdateDocumentationDto } from './dto/update-documentation.dto';


@Controller('documentation')
export class DocumentationController extends BaseController<Documentation, CreateDocumentationDto, UpdateDocumentationDto> {
  
  constructor(private readonly documentationService: DocumentationService) {
    super(documentationService);
  }

}
