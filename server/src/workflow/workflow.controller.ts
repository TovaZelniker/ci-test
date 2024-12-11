import { Controller } from '@nestjs/common';

import { BaseController } from '../controllers/base.controller';
import { CreateWorkflowDto } from './dto/workflow/create-workflow.dto';
import { Workflow } from './schemas/workflow.schema';
import { WorkflowService } from './workflow.service';
import { UpdateWorkflowDto } from './dto/workflow/update-workflow.dto';


@Controller('workflow')
export class WorkflowController extends BaseController<Workflow, CreateWorkflowDto, UpdateWorkflowDto> {
  
  constructor(private readonly workflowService: WorkflowService) {
    super(workflowService);
  }
  
}
