import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDto } from './dto/category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoryService {

  constructor(
      @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  ) { }  

  async getAllCategories(): Promise<Category[]> {
    try {
      const categoryData = await this.categoryModel.find();
      if (!categoryData || categoryData.length == 0) {
        throw new NotFoundException('Category data not found!');
      }
      return categoryData;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }  

  async getCategoryById(id: string): Promise<Category> {
    try {
      const existingCategory = await this.categoryModel.findById(id);
      if (!existingCategory) {
        throw new NotFoundException(`Category #${id} not found`);
      }
      return existingCategory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  } 

  async getCategoriesByIds(ids: string[]): Promise<Category[]>{
    try {
      const categoryData = await this.categoryModel.find({ '_id': { $in: ids } });
      if (!categoryData || categoryData.length == 0) {
        throw new NotFoundException('Category data not found!');
      }
      return categoryData;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }  

  async create(categoryDto: CategoryDto): Promise<Category> {
    try {
      const createdCategory = await this.categoryModel.create(categoryDto);
      return createdCategory;
    } catch {
      throw new InternalServerErrorException();
    }
  }  

  async delete(id: string): Promise<Category> {
    try {
      const deletedCategory = await this.categoryModel.findByIdAndDelete(id);
      if (!deletedCategory) {
        throw new NotFoundException(`Category #${id} not found`);
      }
      return deletedCategory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }  

  async update(id: string, updateCategoryDto: CategoryDto): Promise<Category> {
    try {
      const existingCategory = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });
      if (!existingCategory) {
        throw new NotFoundException(`Category #${id} not found`);
      }
      return existingCategory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
    
}
