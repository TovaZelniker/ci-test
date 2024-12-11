import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import { DbValidationService } from '../../validation/db-validation.service';
import { Role, RoleDocument } from '../../role/schemas/role.schema';
import { Workflow, WorkflowDocument } from '../schemas/workflow.schema';


@Injectable()
export class WorkflowValidationMiddleware implements NestMiddleware {

  constructor(
    private dbValidationService: DbValidationService,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(Workflow.name) private workflowModel: Model<WorkflowDocument>
  ){}
  
  async use(req: Request, res: Response, next: NextFunction) {
    await this.dbValidationService.validateObjectIds(req.body.authorizedRoles,this.roleModel,'authorizedRoles');
    if (req.body.deadline && req.body.deadline?.dependentWorkflow){
      await this.dbValidationService.validateObjectIds([req.body.deadline.dependentWorkflow],this.workflowModel,'dependentWorkflow');
    }
    next();
  }

}

