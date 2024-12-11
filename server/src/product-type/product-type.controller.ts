import { Controller } from '@nestjs/common';

import { BaseController } from '../controllers/base.controller';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { ProductType } from './schemas/product-type.schema';
import { ProductTypeService } from './product-type.service';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';


@Controller('productType')
export class ProductTypeController extends BaseController<ProductType, CreateProductTypeDto, UpdateProductTypeDto> {

  constructor(private readonly productTypeService: ProductTypeService) {
    super(productTypeService);
  }

}
