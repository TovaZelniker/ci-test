import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import { DbValidationService } from '../../validation/db-validation.service';
import { User, UserDocument } from '../../user/schemas/user.schema';


@Injectable()
export class DocumentationValidationMiddleware implements NestMiddleware {

  constructor(
    private dbValidationService: DbValidationService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    await this.dbValidationService.validateObjectIds([req.body.editedBy], this.userModel, 'editedBy');
    next();
  }
}
