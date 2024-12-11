import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { ProductType } from './schemas/product-type.schema';
import { ProductTypeService } from './product-type.service';


describe('ProductTypeService', () => {
  let productTypeService: ProductTypeService;
  let productTypeModel: Model<ProductType>;
  const mockProductTypeData = [
    {
      _id: 'productType_id_1',
      name: 'Test ProductType 1',
      mandatoryCategories: [],
      optionalCategories: [],
      workflow: [],
    },
  ];
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductTypeService,
        {
          provide: getModelToken('ProductType'),
          useValue: {
            find: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                  populate: jest.fn().mockReturnValue(mockProductTypeData),
                }),
              }),
            }),
          },
        },
      ],
    }).compile();

    productTypeService = module.get<ProductTypeService>(ProductTypeService);
    productTypeModel = module.get<Model<ProductType>>(getModelToken('ProductType'));
  });

  it('should be defined', () => {
    expect(productTypeService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all productTypes', async () => { 
      const productTypes = await productTypeService.findAll();
      expect(productTypes).toEqual(mockProductTypeData);
      expect(productTypeModel.find).toHaveBeenCalled();
    });
  });
 
});
