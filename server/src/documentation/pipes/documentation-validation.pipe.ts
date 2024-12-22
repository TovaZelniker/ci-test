import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PipeTransform, Injectable } from '@nestjs/common';

import { CreateDocumentationDto } from '../dto/create-documentation.dto';
import { DbValidationService } from '../../validation/db-validation.service';
import { User, UserDocument } from '../../user/schemas/user.schema';


@Injectable()
export class DocumentationValidationPipe implements PipeTransform {
  constructor(
    private dbValidationService: DbValidationService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }
  
  async transform(data: CreateDocumentationDto) {
    await this.dbValidationService.validateObjectIds([data.editedBy], this.userModel, 'editedBy');
    return data;
  }
}
