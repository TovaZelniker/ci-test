import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseSchema } from '../../schemas/base.schema';
import { Deadline, DeadlineSchema } from './deadline.schema';


export type WorkflowDocument = HydratedDocument<Workflow>;

@Schema()
export class Workflow extends BaseSchema{

  @Prop({ required: true, trim: true })
    name: string;

  @Prop({ required: true })
    isShowToCilent : boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }], required: true, validate: [(val: Types.ObjectId[]) => val.length > 0, 'authorizedRoles must contain at least one element'] })
    authorizedRoles: Types.ObjectId[];

  @Prop({ type: DeadlineSchema, required: true })
    deadline: Deadline;

}

export const WorkflowSchema = SchemaFactory.createForClass(Workflow);
