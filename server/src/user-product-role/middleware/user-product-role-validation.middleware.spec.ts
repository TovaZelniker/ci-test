import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Test, TestingModule } from '@nestjs/testing';

import { DbValidationService } from '../../validation/db-validation.service';
import { RoleDocument } from '../../role/schemas/role.schema';
import { UserDocument } from '../../user/schemas/user.schema';
import { UserProductRoleValidationMiddleware } from './user-product-role-validation.middleware';
import { WorkflowDocument } from '../../workflow/schemas/workflow.schema';


describe('UserProductRoleValidationMiddleware', () => {
  let dbValidationService: DbValidationService;
  let middleware: UserProductRoleValidationMiddleware;
  let userModel: Model<UserDocument>;
  let roleModel: Model<RoleDocument>;
  let workflowModel = Model<WorkflowDocument>;

  const mockUserId = new Types.ObjectId();
  const mockRoleId = new Types.ObjectId();
  const mockWorkflowId = [new Types.ObjectId(), new Types.ObjectId()];

  const mockRequest = {
    body: {
      userId: mockUserId,
      roleId: mockRoleId,
      workflowId: mockWorkflowId
    },
  } as Request;


  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProductRoleValidationMiddleware,
        {
          provide: DbValidationService,
          useValue: { validateObjectIds: jest.fn() },
        },
        {
          provide: 'RoleModel',
          useValue: { find: jest.fn() },
        },
        {
          provide: 'UserModel',
          useValue: { find: jest.fn() },
        },
        {
          provide: 'WorkflowModel',
          useValue: { find: jest.fn() },
        },
      ],
    }).compile();

    dbValidationService = module.get<DbValidationService>(DbValidationService);
    middleware = module.get<UserProductRoleValidationMiddleware>(UserProductRoleValidationMiddleware);
    roleModel = module.get<Model<RoleDocument>>('RoleModel');
    userModel = module.get<Model<UserDocument>>('UserModel');
    workflowModel = module.get<Model<WorkflowDocument>>('WorkflowModel');
  });

  it('should call next if all IDs exist', async () => {
    const mockNext = jest.fn();
    jest.spyOn(dbValidationService, 'validateObjectIds').mockResolvedValue(undefined);

    await middleware.use(mockRequest, mockResponse, mockNext);

    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith([mockUserId], userModel, 'userId');
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith([mockRoleId], roleModel, 'roleId');
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith(mockWorkflowId, workflowModel, 'workflowId');
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledTimes(3);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should skip orderId validation if not provided', async () => {
    const mockRequestWithoutworkflowId = {
      body: {
        userId: mockUserId,
        roleId: mockRoleId
      },
    } as Request;

    const mockNext = jest.fn();
    jest.spyOn(dbValidationService, 'validateObjectIds').mockResolvedValue(undefined);

    await middleware.use(mockRequestWithoutworkflowId, mockResponse, mockNext);

    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith([mockUserId], userModel, 'userId');
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith([mockRoleId], roleModel, 'roleId');
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledTimes(2);
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
