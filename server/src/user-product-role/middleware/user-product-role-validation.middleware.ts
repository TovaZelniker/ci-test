import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import { DbValidationService } from '../../validation/db-validation.service';
import { Role, RoleDocument } from '../../role/schemas/role.schema';
import { User, UserDocument } from '../../user/schemas/user.schema';
import { Workflow, WorkflowDocument } from '../../workflow/schemas/workflow.schema';


@Injectable()
export class UserProductRoleValidationMiddleware implements NestMiddleware {

  constructor(
    private dbValidationService: DbValidationService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(Workflow.name) private workflowModel: Model<WorkflowDocument>
    //TODO @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    await this.dbValidationService.validateObjectIds([req.body.userId], this.userModel, 'userId');
    await this.dbValidationService.validateObjectIds([req.body.roleId], this.roleModel, 'roleId');
    if (req.body.workflowId) {
      await this.dbValidationService.validateObjectIds(req.body.workflowId, this.workflowModel, 'workflowId');
    }
    //TODO await this.dbValidationService.validateObjectIds(req.body.productId, this.productModel, 'productId');
    next();
  }
}
