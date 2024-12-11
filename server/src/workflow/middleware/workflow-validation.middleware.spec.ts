import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Test, TestingModule } from '@nestjs/testing';

import { DbValidationService } from '../../validation/db-validation.service';
import { RoleDocument } from '../../role/schemas/role.schema';
import { WorkflowDocument } from '../schemas/workflow.schema';
import { WorkflowValidationMiddleware } from './workflow-validation.middleware';


describe('WorkflowValidationMiddleware', () => {
  let dbValidationService: DbValidationService;
  let middleware: WorkflowValidationMiddleware;
  let roleModel: Model<RoleDocument>;
  let workflowModel: Model<WorkflowDocument>;

  const mockRequest = {
    body: {
      authorizedRoles: [new Types.ObjectId(), new Types.ObjectId()],
      deadline: { dependentWorkflow: new Types.ObjectId() }
    },
  } as Request;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowValidationMiddleware,
        {
          provide: DbValidationService,
          useValue: { validateObjectIds: jest.fn() },
        },
        {
          provide: 'RoleModel',
          useValue: { find: jest.fn() },
        },
        {
          provide: 'WorkflowModel',
          useValue: { find: jest.fn() },
        },
      ],
    }).compile();

    middleware = module.get<WorkflowValidationMiddleware>(WorkflowValidationMiddleware);
    dbValidationService = module.get<DbValidationService>(DbValidationService);
    roleModel = module.get<Model<RoleDocument>>('RoleModel');
    workflowModel = module.get<Model<WorkflowDocument>>('WorkflowModel');
  });

  it('should call next if all IDs exist', async () => {
    const mockNext = jest.fn();
    jest.spyOn(dbValidationService, 'validateObjectIds').mockResolvedValue(undefined);
    await middleware.use(mockRequest, mockResponse, mockNext);
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith(
      mockRequest.body.authorizedRoles,roleModel,'authorizedRoles');
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith(
      [mockRequest.body.deadline.dependentWorkflow],workflowModel,'dependentWorkflow');
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledTimes(2);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should not call validateObjectIds function if deadline object not exist', async () => {
    const mockNext = jest.fn();
    const mockRequest = {
      body: {
        authorizedRoles: [new Types.ObjectId(), new Types.ObjectId()]
      },
    } as Request;
    jest.spyOn(dbValidationService, 'validateObjectIds').mockResolvedValue(undefined);
    await middleware.use(mockRequest, mockResponse, mockNext);
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith(
      mockRequest.body.authorizedRoles,roleModel,'authorizedRoles');
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
