import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import { DbValidationService } from '../../validation/db-validation.service';
import { Role, RoleDocument } from '../../role/schemas/role.schema';


@Injectable()
export class AlertValidationMiddleware implements NestMiddleware {

  constructor(
    private dbValidationService: DbValidationService,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    await this.dbValidationService.validateObjectIds(req.body.recipients, this.roleModel, 'recipients');
    next();
  }
}
