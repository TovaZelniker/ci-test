import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { UserProductRoleController } from './user-product-role.controller';
import { UserProductRoleService } from './user-product-role.service';

const result = [{ id: '1', userId: 'A' }];

const mockUserProductRoleService = {
  getByUser: jest.fn().mockResolvedValue(result),
  getByProduct: jest.fn().mockResolvedValue(result)
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

  describe('getByUser', () => {
    it('should return an array of products by users', async () => {
      const userId = new Types.ObjectId();

      expect(await controller.getByUser(userId)).toBe(result);
      expect(service.getByUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('getByProduct', () => {
    it('should return an array of users by product', async () => {
      const productId = new Types.ObjectId();

      expect(await controller.getByProduct(productId)).toBe(result);
      expect(service.getByProduct).toHaveBeenCalledWith(productId);
    });
  });
});
