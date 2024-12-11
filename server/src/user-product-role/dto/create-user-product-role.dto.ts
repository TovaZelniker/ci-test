import { Types } from 'mongoose';


export class CreateUserProductRoleDto {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  roleId: Types.ObjectId;
  workflowId: Types.ObjectId[];
}
