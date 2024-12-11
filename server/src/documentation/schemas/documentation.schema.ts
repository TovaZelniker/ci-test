import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { DocumentationType } from './documentation-type.enum';

export type DocumentationDocument = HydratedDocument<Documentation>;

@Schema()
export class Documentation {

  @Prop({ required: true }) productId: Types.ObjectId;//TODO: link to a product's schema later on

  @Prop({ required: true, trim: true }) content: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' }) editedBy: Types.ObjectId;

  @Prop({ required: true }) isManualChange: boolean;

  @Prop({
    enum: DocumentationType,
    required: true
  }) type: number;

  @Prop({ required: true }) date: Date;

}

export const DocumentationSchema = SchemaFactory.createForClass(Documentation);
