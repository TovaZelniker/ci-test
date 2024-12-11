import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Test, TestingModule } from '@nestjs/testing';

import { CategoryDocument } from '../../category/schemas/category.schema';
import { DbValidationService } from '../../validation/db-validation.service';
import { ProductTypeValidation } from './product-type-validation.middleware';
import { WorkflowDocument } from '../../workflow/schemas/workflow.schema';


describe('ProductTypeValidation', () => {
  let middleware: ProductTypeValidation;
  let dbValidationService: DbValidationService;
  let categoryModel: Model<CategoryDocument>;
  let workflowModel: Model<WorkflowDocument>;

  const mockRequest = {
    body: {
      mandatoryCategories: [new Types.ObjectId(), new Types.ObjectId()],
      optionalCategories: [new Types.ObjectId(), new Types.ObjectId()],
      workflow: [new Types.ObjectId(), new Types.ObjectId()]
    },
  } as Request;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductTypeValidation,
        {
          provide: DbValidationService,
          useValue: { validateObjectIds: jest.fn() },
        },
        {
          provide: 'CategoryModel',
          useValue: { find: jest.fn() },
        },
        {
          provide: 'WorkflowModel',
          useValue: { find: jest.fn() },
        },
      ],
    }).compile();

    middleware = module.get<ProductTypeValidation>(ProductTypeValidation);
    dbValidationService = module.get<DbValidationService>(DbValidationService);
    categoryModel = module.get<Model<CategoryDocument>>('CategoryModel');
    workflowModel = module.get<Model<WorkflowDocument>>('WorkflowModel');
  });

  it('should call next if all IDs exist', async () => {
    const mockNext = jest.fn();
    jest.spyOn(dbValidationService, 'validateObjectIds').mockResolvedValue(undefined);
    await middleware.use(mockRequest, mockResponse, mockNext);
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith(
      mockRequest.body.mandatoryCategories,categoryModel,'mandatoryCategories');
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith(
      mockRequest.body.optionalCategories,categoryModel,'optionalCategories');
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith(
      mockRequest.body.workflow,workflowModel,'workflow');
    expect(mockNext).toHaveBeenCalled();
  });

  it('should throw NotFoundException if any ID does not exist', async () => {
    const mockNext = jest.fn();
    jest.spyOn(dbValidationService, 'validateObjectIds').mockRejectedValue(
      new NotFoundException('One or more IDs do not exist')
    );
    await expect(middleware.use(mockRequest, mockResponse, mockNext)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

});
