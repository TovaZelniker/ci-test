import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Types } from 'mongoose';

import { BaseService } from '../services/base.service';


@Controller()
export class BaseController<TModel, TCreateDTO, TUpdateDTO> {
  constructor(private readonly baseService: BaseService<TModel, TCreateDTO, TUpdateDTO>) {}

  @Post()
  async create(@Body() data: TCreateDTO) {
    return this.baseService.create(data);
  }

  @Get()
  async findAll() {
    return this.baseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId) {
    return this.baseService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: Types.ObjectId, @Body() data: TUpdateDTO) {
    return this.baseService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: Types.ObjectId) {
    return this.baseService.delete(id);
  }
}
