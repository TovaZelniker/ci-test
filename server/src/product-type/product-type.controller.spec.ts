import { Test, TestingModule } from '@nestjs/testing';

import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';
import { mockServiceMethods } from '../test-utils/mock-service';


describe('ProductTypeController', () => {
  let controller: ProductTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductTypeController],
      providers: [
        {
          provide: ProductTypeService,
          useValue: mockServiceMethods
        },
      ],
    }).compile();

    controller = module.get<ProductTypeController>(ProductTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
