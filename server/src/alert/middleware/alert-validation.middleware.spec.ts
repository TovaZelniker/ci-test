import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Test, TestingModule } from '@nestjs/testing';

import { AlertValidationMiddleware } from './alert-validation.middleware';
import { DbValidationService } from '../../validation/db-validation.service';
import { RoleDocument } from '../../role/schemas/role.schema';


describe('AlertValidationMiddleware', () => {
  let dbValidationService: DbValidationService;
  let middleware: AlertValidationMiddleware;
  let roleModel: Model<RoleDocument>;

  const mockRequest = {
    body: {
      recipients: [new Types.ObjectId(), new Types.ObjectId()]
    },
  } as Request;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertValidationMiddleware,
        {
          provide: DbValidationService,
          useValue: { validateObjectIds: jest.fn() },
        },
        {
          provide: 'RoleModel',
          useValue: { find: jest.fn() },
        },
      ],
    }).compile();

    dbValidationService = module.get<DbValidationService>(DbValidationService);
    middleware = module.get<AlertValidationMiddleware>(AlertValidationMiddleware);    
    roleModel = module.get<Model<RoleDocument>>('RoleModel');
  });

  it('should call next if all IDs exist', async () => {
    const mockNext = jest.fn();
    jest.spyOn(dbValidationService, 'validateObjectIds').mockResolvedValue(undefined);

    await middleware.use(mockRequest, mockResponse, mockNext);

    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith(
      mockRequest.body.recipients, roleModel, 'recipients');
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
