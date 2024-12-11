import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseSchema } from '../../schemas/base.schema';


export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role extends BaseSchema {

  @Prop({ required: true, trim: true }) name: string;

}

export const RoleSchema = SchemaFactory.createForClass(Role);
