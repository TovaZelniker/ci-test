import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import { Category, CategoryDocument } from '../../category/schemas/category.schema';
import { DbValidationService } from '../../validation/db-validation.service';
import { Workflow, WorkflowDocument } from '../../workflow/schemas/workflow.schema';


@Injectable()
export class ProductTypeValidation implements NestMiddleware {
  
  constructor(
    private dbValidationService: DbValidationService,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Workflow.name) private workflowModel: Model<WorkflowDocument>
  ){}
  
  async use(req: Request, res: Response, next: NextFunction) {
    await this.dbValidationService.validateObjectIds(req.body['mandatoryCategories'],this.categoryModel,'mandatoryCategories');
    await this.dbValidationService.validateObjectIds(req.body['optionalCategories'],this.categoryModel,'optionalCategories');
    await this.dbValidationService.validateObjectIds(req.body['workflow'],this.workflowModel,'workflow');
    next();
  }
}
