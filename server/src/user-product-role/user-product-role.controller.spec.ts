import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { UserProductRoleController } from './user-product-role.controller';
import { UserProductRoleService } from './user-product-role.service';

const result = [{ id: '1', userId: 'A' }];

const mockUserProductRoleService = {
  getProductsByUserId: jest.fn().mockResolvedValue(result),
  getUsersByProductId: jest.fn().mockResolvedValue(result)
};

describe('UserProductRoleController', () => {
  let controller: UserProductRoleController;
  let service: UserProductRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProductRoleController],
      providers: [
        UserProductRoleService,
        {
          provide: UserProductRoleService,
          useValue: mockUserProductRoleService
        },
      ],
    }).compile();

    controller = module.get<UserProductRoleController>(UserProductRoleController);
    service = module.get<UserProductRoleService>(UserProductRoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProductsByUserId', () => {
    it('should return an array of products by users', async () => {
      const userId = new Types.ObjectId();

      expect(await controller.getProductsByUser(userId)).toBe(result);
      expect(service.getProductsByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('getUsersByProduct', () => {
    it('should return an array of users by product', async () => {
      const productId = new Types.ObjectId();

      expect(await controller.getUsersByProduct(productId)).toBe(result);
      expect(service.getUsersByProductId).toHaveBeenCalledWith(productId);
    });
  });
});
