import { PartialType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';

import { CreateProductDto } from './create-product.dto';


export class UpdateProductDto extends PartialType(CreateProductDto) {
  subProduct?: Types.ObjectId[];
  cancellationOrDelayReason: number;
  devQuarter: string;
  targetAudience: string;
  validationDate: Date;
  taskManager: Types.ObjectId;
}
