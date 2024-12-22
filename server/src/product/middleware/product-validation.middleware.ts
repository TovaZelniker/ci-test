import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import { DbValidationService } from '../../validation/db-validation.service';
import {
  ProductType,
  ProductTypeDocument,
} from '../../product-type/schemas/product-type.schema';
import { User, UserDocument } from '../../user/schemas/user.schema';


@Injectable()
export class ProductValidationMiddleware implements NestMiddleware {
  
  constructor(
    private dbValidationService: DbValidationService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ProductType.name)
    private productTypeModel: Model<ProductTypeDocument>,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    await this.dbValidationService.validateObjectIds(
      req.body.projector,
      this.userModel,
      'projector',
    );
    await this.dbValidationService.validateObjectIds(
      req.body.contentSpecialist,
      this.userModel,
      'contentSpecialist',
    );
    await this.dbValidationService.validateObjectIds(
      req.body.productType,
      this.productTypeModel,
      'productType',
    );
    next();
  }
}
