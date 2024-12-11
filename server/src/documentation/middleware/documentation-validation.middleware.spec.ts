import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Test, TestingModule } from '@nestjs/testing';

import { DbValidationService } from '../../validation/db-validation.service';
import { UserDocument } from '../../user/schemas/user.schema';
import { DocumentationValidationMiddleware } from './documentation-validation.middleware';


describe('UserValidationMiddleware', () => {
  let dbValidationService: DbValidationService;
  let middleware: DocumentationValidationMiddleware;
  let userModel: Model<UserDocument>;

  const mockRequest = {
    body: {
      editedBy: new Types.ObjectId()
    },
  } as Request;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentationValidationMiddleware,
        {
          provide: DbValidationService,
          useValue: { validateObjectIds: jest.fn() },
        },
        {
          provide: 'UserModel',
          useValue: { find: jest.fn() },
        },
      ],
    }).compile();

    dbValidationService = module.get<DbValidationService>(DbValidationService);
    middleware = module.get<DocumentationValidationMiddleware>(DocumentationValidationMiddleware);    
    userModel = module.get<Model<UserDocument>>('UserModel');
  });

  it('should call next if all IDs exist', async () => {
    const mockNext = jest.fn();
    jest.spyOn(dbValidationService, 'validateObjectIds').mockResolvedValue(undefined);
    await middleware.use(mockRequest, mockResponse, mockNext);
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith(
      [mockRequest.body.editedBy], userModel, 'editedBy');
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledTimes(1);
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
