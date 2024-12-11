import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';

import { UserProductRoleSchema } from './user-product-role.schema';


const UserProductRoleModel = mongoose.model('UserProductRole', UserProductRoleSchema);
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});


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

  it('should enforce unique index on userId, productId, and roleId', async () => {
    const data = {
      userId: new Types.ObjectId(),
      productId: new Types.ObjectId(),
      roleId: new Types.ObjectId(),
      workflowId: [new Types.ObjectId()],
    };

    const data1 = new UserProductRoleModel(data)
    await data1.save();

    const duplicateEntry = data1;
    let validationError;

    try {
      await duplicateEntry.save();
    } catch (error) {
      validationError = error;
    }

    expect(validationError).toBeDefined();
    expect(validationError.code).toBe(11000);
  });
});