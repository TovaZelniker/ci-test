import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


export type DeadlineDocument = HydratedDocument<Deadline>;

@Schema({ _id: false })
export class Deadline {

  @Prop({
    required: true,
    trim: true,
    match: [/^\d+(\.\d+)?[md]$/, 'Timing must be a number (integer or decimal) followed by "m" for months or "d" for days, e.g., "1m" or "5d"'],
  })
    timing: string;

  @Prop({ type: Types.ObjectId, ref: 'Workflow'})
    dependentWorkflow : Types.ObjectId;

}

export const DeadlineSchema = SchemaFactory.createForClass(Deadline);
