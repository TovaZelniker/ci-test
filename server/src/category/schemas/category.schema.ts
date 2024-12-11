import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseSchema } from '../../schemas/base.schema';


export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category extends BaseSchema {

  @Prop({ required: true, trim: true }) name: string;

  @Prop({
    type: [String], required: true, validate: [
      {
        validator: (val: string[]) => val.length > 0,
        message: 'supportedFiles must contain at least one element'
      },
      {
        validator: (val: string[]) => val.every(file => file.trim().length > 0),
        message: 'File cannot be an empty string'
      }]
  }) supportedFiles: string[];

}

export const CategorySchema = SchemaFactory.createForClass(Category);
