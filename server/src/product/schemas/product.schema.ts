import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Reason } from './product-reason.enum';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ required: true, trim: true })
    name: string;

  @Prop({ enum: Reason })
    cancellationOrDelayReason: number;

  @Prop({ type: String, required: true, default: new Date() })
    openRequest: string;

  @Prop({ required: true, trim: true })
    orderBranch: string;

  @Prop({ required: true, trim: true })
    orderSection: string;

  @Prop({ required: true, trim: true })
    orderCourse: string;

  @Prop({ required: true, trim: true })
    summary: string;

  @Prop({ required: true, trim: true })
    purpose: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'user',
  })
    projector: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'user',
  })
    contentSpecialist: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'product-type',
  })
    productType: Types.ObjectId;

  @Prop({ required: true })
    deadline: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'user',
  })
    taskManager: Types.ObjectId;

  @Prop({
    type: [
      {
        workflowStatus: { type: Number, required: true },
        isCompleted: { type: Boolean, required: true },
        deadline: { type: Date, required: true },
        changesNumber: { type: Number, required: true },
      },
    ],
    required: true,
  })
    status: {
      workflowStatus: number;
      isCompleted: boolean;
      deadline: Date;
      changesNumber: number;
    }[];

  @Prop({
    type: [
      {
        categoryId: { type: Types.ObjectId, ref: 'category', required: true },
        files: { type: [String], required: true },
      },
    ],
    required: true,
  })
    mandatoryCategories: {
      categoryId: Types.ObjectId;
      files: string[];
    }[];

  @Prop({
    type: [
      {
        categoryId: { type: Types.ObjectId, ref: 'category', required: true },
        files: { type: [String], required: true },
      },
    ],
    required: true,
  })
    optionalCategories: {
      categoryId: Types.ObjectId;
      files: string[];
    }[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'product',
    default: [],
  })
    subProduct?: Types.ObjectId[];

  @Prop({ trim: true })
    devQuarter: string;

  @Prop({ trim: true })
    targetAudience: string;

  @Prop()
    validationDate: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
