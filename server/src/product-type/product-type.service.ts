import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseService } from '../services/base/base.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { ProductType } from './schemas/product-type.schema';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';


@Injectable()
export class ProductTypeService extends BaseService<ProductType, CreateProductTypeDto, UpdateProductTypeDto> {
  
  constructor(@InjectModel(ProductType.name) private productTypeModel: Model<ProductType>) {
    super(productTypeModel);
  }

  async findAll(): Promise<ProductType[]> {
    const productTypesData = await this.productTypeModel.find()
      .populate({ path: 'mandatoryCategories', model: 'Category' })
      .populate({ path: 'optionalCategories', model: 'Category' })
      .populate({ path: 'workflow', model: 'Workflow', populate: { path: 'authorizedRoles', model: 'Role' } });
    return productTypesData;
  }  
  
}