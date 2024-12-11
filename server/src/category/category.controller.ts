import { Controller } from '@nestjs/common';

import { BaseController } from '../controllers/base.controller';
import { Category } from './schemas/category.schema';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Controller('category')
export class CategoryController extends BaseController<Category, CreateCategoryDto, UpdateCategoryDto> {

  constructor(private readonly categoryService: CategoryService) {
    super(categoryService);
  }

}
