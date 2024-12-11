import { Test, TestingModule } from '@nestjs/testing';

import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { mockServiceMethods } from '../test-utils/mock-service';


describe('WorkflowController', () => {
  let controller: WorkflowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowController],
      providers: [
        {
          provide: WorkflowService,
          useValue: mockServiceMethods
        },
      ],
    }).compile();

    controller = module.get<WorkflowController>(WorkflowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
