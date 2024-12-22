import { Controller } from '@nestjs/common';

import { BaseController } from '../controllers/base.controller';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schemas/product.schema';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';


@Controller('product')
export class ProductController extends BaseController<
  Product,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(private readonly productService: ProductService) {
    super(productService);
  }
}
