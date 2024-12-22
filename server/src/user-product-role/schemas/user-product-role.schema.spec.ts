import mongoose, { Types } from 'mongoose';

import { UserProductRoleSchema } from './user-product-role.schema';


const UserProductRoleModel = mongoose.model('UserProductRole', UserProductRoleSchema);


describe('UserProductRole Schema Validations', () => {
  it('should create a valid UserProductRole document', () => {
    const data = {
      userId: new Types.ObjectId(),
      productId: new Types.ObjectId(),
      roleId: new Types.ObjectId(),
      workflowId: [new Types.ObjectId()],
    };

    const userProductRole = new UserProductRoleModel(data);
    const validationError = userProductRole.validateSync();

    expect(validationError).toBeUndefined();
  });

  it('should be invalid if userId is missing', () => {
    const data = {
      productId: new Types.ObjectId(),
      roleId: new Types.ObjectId(),
      workflowId: [new Types.ObjectId()],
    };

    const userProductRole = new UserProductRoleModel(data);
    const validationError = userProductRole.validateSync();

    expect(validationError.errors['userId']).toBeDefined();
  });

  it('should be invalid if productId is missing', () => {
    const data = {
      userId: new Types.ObjectId(),
      roleId: new Types.ObjectId(),
      workflowId: [new Types.ObjectId()],
    };

    const userProductRole = new UserProductRoleModel(data);
    const validationError = userProductRole.validateSync();

    expect(validationError.errors['productId']).toBeDefined();
  });

  it('should be invalid if roleId is missing', () => {
    const data = {
      userId: new Types.ObjectId(),
      productId: new Types.ObjectId(),
      workflowId: [new Types.ObjectId()],
    };

    const userProductRole = new UserProductRoleModel(data);
    const validationError = userProductRole.validateSync();

    expect(validationError.errors['roleId']).toBeDefined();
  });
});