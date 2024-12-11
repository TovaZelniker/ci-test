import { Test, TestingModule } from '@nestjs/testing';

import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { mockServiceMethods } from '../test-utils/mock-service';


describe('RoleController', () => {
  let controller: RoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: mockServiceMethods
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
