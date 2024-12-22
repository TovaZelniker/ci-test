import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';

import { DbValidationService } from '../../validation/db-validation.service';
import { ProductTypeDocument } from '../../product-type/schemas/product-type.schema';
import { ProductValidationMiddleware } from './product-validation.middleware';
import { UserDocument } from '../../user/schemas/user.schema';


describe('ProductValidationMiddleware', () => {
  let dbValidationService: DbValidationService;
  let middleware: ProductValidationMiddleware;
  let userModel: Model<UserDocument>;
  let productTypeModel: Model<ProductTypeDocument>;

  const mockRequest = {
    body: {
      projector: [new Types.ObjectId(), new Types.ObjectId()],
      contentSpecialist: [new Types.ObjectId(), new Types.ObjectId()],
      productType: [new Types.ObjectId()],
    },
  } as Request;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductValidationMiddleware,
        {
          provide: DbValidationService,
          useValue: { validateObjectIds: jest.fn() },
        },
        {
          provide: 'UserModel',
          useValue: { find: jest.fn() },
        },
        {
          provide: 'ProductTypeModel',
          useValue: { find: jest.fn() },
        },
      ],
    }).compile();

    dbValidationService = module.get<DbValidationService>(DbValidationService);
    middleware = module.get<ProductValidationMiddleware>(
      ProductValidationMiddleware,
    );
    userModel = module.get<Model<UserDocument>>('UserModel');
    productTypeModel =
      module.get<Model<ProductTypeDocument>>('ProductTypeModel');
  });

  it('should call next if all IDs exist', async () => {
    const mockNext = jest.fn();
    jest
      .spyOn(dbValidationService, 'validateObjectIds')
      .mockResolvedValue(undefined);
    await middleware.use(mockRequest, mockResponse, mockNext);
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith(
      mockRequest.body.projector,
      userModel,
      'projector',
    );
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith(
      mockRequest.body.contentSpecialist,
      userModel,
      'contentSpecialist',
    );
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith(
      expect.arrayContaining(mockRequest.body.productType),
      productTypeModel,
      'productType',
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it('should throw NotFoundException if any ID does not exist', async () => {
    const mockNext = jest.fn();
    jest
      .spyOn(dbValidationService, 'validateObjectIds')
      .mockRejectedValue(new NotFoundException('One or more IDs do not exist'));
    await expect(
      middleware.use(mockRequest, mockResponse, mockNext),
    ).rejects.toThrow(NotFoundException);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
