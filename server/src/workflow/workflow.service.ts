import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { BaseService } from '../services/base/base.service';
import { CreateWorkflowDto } from './dto/workflow/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/workflow/update-workflow.dto';
import { Workflow } from './schemas/workflow.schema';


@Injectable()
export class WorkflowService extends BaseService<Workflow, CreateWorkflowDto, UpdateWorkflowDto>{
  
  constructor(@InjectModel(Workflow.name) private workflowModel: Model<Workflow>) {
    super(workflowModel);
  }

  async findAll(): Promise<Workflow[]> {
    const workflowsData = await this.workflowModel.find().populate({
      path: 'authorizedRoles', 
      model: 'Role',
    });
    return workflowsData;
  }  

  async update(id: Types.ObjectId, updateWorkflowDto: CreateWorkflowDto): Promise<Workflow> {
    if (updateWorkflowDto.deadline && updateWorkflowDto.deadline.dependentWorkflow && updateWorkflowDto.deadline.dependentWorkflow == id){
      throw new BadRequestException('Workflow cannot depend on itself');
    }
    return super.update(id, updateWorkflowDto);
  }

}
