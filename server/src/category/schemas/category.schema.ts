import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {

  @Prop({ required: true })
    name: string;

  @Prop({ type: [String] })
    supportedFiles: string[];

}

export const CategorySchema = SchemaFactory.createForClass(Category);
