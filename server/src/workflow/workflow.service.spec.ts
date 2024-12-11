import { BadRequestException } from '@nestjs/common/exceptions';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { BaseService } from '../services/base.service';
import { Workflow } from './schemas/workflow.schema';
import { CreateWorkflowDto } from './dto/workflow/create-workflow.dto';
import { WorkflowService } from './workflow.service';


describe('WorkflowService', () => {
  let workflowService: WorkflowService;
  let workflowModel: Model<Workflow>;
  const id = new Types.ObjectId();
  const testWorkflow: CreateWorkflowDto = { name: 'workflow', isShowToCilent: true, authorizedRoles:[new Types.ObjectId()], deadline:{ timing:'', dependentWorkflow:new Types.ObjectId() }};
  const mockWorkflowData = [
    {
      _id: 'workflow_id_1',
      name: 'Test Workflow 1',
      isShowToSilent: true,
      authorizedRoles: [{ _id: 'role_id_1', name: 'Test Role' }],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowService,
        {
          provide: getModelToken('Workflow'),
          useValue: {
            find: jest.fn().mockReturnThis(),
            populate: jest.fn().mockResolvedValue(mockWorkflowData),
            findByIdAndUpdate: jest.fn().mockResolvedValue(testWorkflow)
          },
        },
      ],
    }).compile();

    workflowService = module.get<WorkflowService>(WorkflowService);
    workflowModel = module.get<Model<Workflow>>(getModelToken('Workflow'));
  });

  it('should be defined', () => {
    expect(workflowService).toBeDefined();
  });
 
  describe('findAll', () => {
    it('should return all workflows with populated roles', async () => {
      const workflows = await workflowService.findAll();
      expect(workflows).toEqual(mockWorkflowData);
      expect(workflowModel.find).toHaveBeenCalled();
      expect(workflowModel.populate).toHaveBeenCalledWith({
        path: 'authorizedRoles',
        model: 'Role',
      });
    });

  });

  describe('update', () => {
    it('should return updated workflow', async () => {
      const baseUpdate = jest.spyOn(BaseService.prototype, 'update');
      const result = await workflowService.update(id, testWorkflow);
      expect(result).toEqual(testWorkflow);
      expect(workflowModel.findByIdAndUpdate).toHaveBeenCalledWith(id, testWorkflow, { new: true, runValidators: true });
      expect(baseUpdate).toHaveBeenCalledWith(id, testWorkflow);
    });

    it('should throw NotFoundException if no workflow by id', async () => {
      jest.spyOn(workflowModel, 'findByIdAndUpdate').mockResolvedValue(null);
      await expect(workflowService.update(id, testWorkflow)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if depend on itself', async () => {
      const testId = new Types.ObjectId;
      const testWorkflow: CreateWorkflowDto = { name: 'workflow', isShowToCilent: true, authorizedRoles:[new Types.ObjectId()], deadline:{ timing:'', dependentWorkflow: testId }};
      jest.spyOn(workflowModel, 'findByIdAndUpdate').mockResolvedValue(testWorkflow as any);
      await expect(workflowService.update(testId, testWorkflow)).rejects.toThrow(BadRequestException);
    });
    
  });

});
