import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseSchema } from '../../schemas/base.schema';
import { Reason } from './alert-reason.enum';


export type AlertDocument = HydratedDocument<Alert>;

@Schema()
export class Alert extends BaseSchema {

  @Prop({ enum: Reason, required: true })
    alertReason: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }], required: true, validate: [(val: Types.ObjectId[]) => val.length > 0, 'recipients must contain at least one element'] })
    recipients: Types.ObjectId[];

  @Prop({ required: true, trim: true })
    content: string;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
