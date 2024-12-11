import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { UserProductRoleService } from './user-product-role.service';


describe('UserProductRoleService', () => {
  let service: UserProductRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProductRoleService,
        {
          provide: getModelToken('UserProductRole'),
          useValue: { find: jest.fn() }
        },
      ],
    }).compile();

    service = module.get<UserProductRoleService>(UserProductRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //TODO Test getByUser and getByProduct functions
});
