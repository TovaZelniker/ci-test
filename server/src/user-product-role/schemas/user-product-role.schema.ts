import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


export type UserProductRoleDocument = HydratedDocument<UserProductRole>;

@Schema()
export class UserProductRole {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
    roleId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Workflow' }] })
    workflowId: Types.ObjectId[];
}

export const UserProductRoleSchema = SchemaFactory.createForClass(UserProductRole);

const sortOrder = 1;
UserProductRoleSchema.index({ userId: sortOrder, roleId: sortOrder, productId: sortOrder }, { unique: true });
