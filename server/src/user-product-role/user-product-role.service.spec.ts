import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { UserProductRole } from './schemas/user-product-role.schema';
import { UserProductRoleService } from './user-product-role.service';


const mockUserProductRole = {
  productId: new Types.ObjectId(),
  userId: new Types.ObjectId(),
};

const mockUserProductRoleModel = {
  find: jest.fn().mockReturnThis(),
  populate: jest.fn().mockResolvedValue([mockUserProductRole]),
  exec: jest.fn().mockResolvedValue([mockUserProductRole]),
};

describe('UserProductRoleService', () => {
  let service: UserProductRoleService;
  let model: Model<UserProductRole>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProductRoleService,
        {
          provide: getModelToken('UserProductRole'),
          useValue: mockUserProductRoleModel
        },
      ],
    }).compile();

    service = module.get<UserProductRoleService>(UserProductRoleService);
    model = module.get<Model<UserProductRole>>(getModelToken('UserProductRole'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProductsByUser', () => {
    it('should return record filtered by product', async () => {
      const result = await service.getProductsByUserId(mockUserProductRole.userId);

      expect(result).toEqual([mockUserProductRole]);
      expect(model.find).toHaveBeenCalledWith({ userId: mockUserProductRole.userId });
      expect(model.populate).toHaveBeenCalledWith({
        path: 'productId',
        model: 'Product',
      });
    });
  });

  describe('getUsersByProduct', () => {
    it('should return record filtered by product', async () => {
      const result = await service.getUsersByProductId(mockUserProductRole.productId);

      expect(result).toEqual([mockUserProductRole]);
      expect(model.find).toHaveBeenCalledWith({ productId: mockUserProductRole.productId });
      expect(model.populate).toHaveBeenCalledWith({
        path: 'userId',
        model: 'User',
      });
    });
  });
});
