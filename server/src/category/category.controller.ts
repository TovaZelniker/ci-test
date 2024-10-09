import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {

  constructor(private categoryService: CategoryService) { }  
  @Get()
  async get() {
    return await this.categoryService.getAllCategories();
  }  
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.categoryService.getCategoryById(id);
  }  
  @Post()
  async create(@Body() createCategoryDto: CategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: CategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }  
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.categoryService.delete(id);
  }

}
