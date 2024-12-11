import { Types } from 'mongoose';

import { BaseDto } from '../../dtos/base.dto';


export class CreateProductTypeDto extends BaseDto{
  name: string;
  mandatoryCategories: Types.ObjectId[];
  optionalCategories: Types.ObjectId[];
  workflow: Types.ObjectId[];
}
