import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseService } from '../services/base.service';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Injectable()
export class CategoryService extends BaseService<Category, CreateCategoryDto, UpdateCategoryDto> {

  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {
    super(categoryModel);
  }

}
