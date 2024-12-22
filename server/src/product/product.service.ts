import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseService } from '../services/base/base.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schemas/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';


@Injectable()
export class ProductService extends BaseService<Product, CreateProductDto, UpdateProductDto> {

  constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {
    super(productModel);
  }
}
