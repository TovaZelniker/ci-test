import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { BaseSchema } from '../../schemas/base.schema';


export type ProductTypeDocument = HydratedDocument<ProductType>;

@Schema()
export class ProductType extends BaseSchema{

  @Prop({ required: true, trim: true })
    name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }],  required: true, validate: [(val: Types.ObjectId[]) => val.length > 0, 'mandatoryCategories must contain at least one element'] })
    mandatoryCategories: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }], required: true, default: undefined })
    optionalCategories: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Workflow' }], required: true, validate: [(val: Types.ObjectId[]) => val.length > 0, 'workflow must contain at least one element']})
    workflow: Types.ObjectId[];

}

export const ProductTypeSchema = SchemaFactory.createForClass(ProductType);
