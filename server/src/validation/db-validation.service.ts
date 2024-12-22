import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';


@Injectable()
export class DbValidationService {
  
  async validateObjectIds(ids: Types.ObjectId[], model: Model<any>, fieldName: string): Promise<void> {
    if(!ids || ids.length == 0 ){
      return;
    }
    const isValid = ids.every(id => Types.ObjectId.isValid(id));
    if (!isValid) {
      throw new BadRequestException('One or more identifiers are not valid ObjectIds');
    }
    const documents = await model.find({ _id: { $in: ids } });
    if (documents.length !== ids.length) {
      throw new NotFoundException(`One or more ${fieldName} IDs do not exist`);
    }
  }
  
}
