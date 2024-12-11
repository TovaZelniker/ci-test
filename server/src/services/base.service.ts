import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';


export class BaseService<TModel, TCreateDTO, TUpdateDTO> {
  constructor(private readonly model: Model<TModel>) { }

  async create(data: TCreateDTO): Promise<TModel> {
    const createdItem = await this.model.create(data);
    return createdItem;
  }

  async findAll(): Promise<TModel[]> {
    return await this.model.find();
  }

  async findByProperty(property: object, path?: string, model?: string): Promise<TModel[]> {
    return path && model
      ? await this.model.find(property).populate({ path, model })
      : await this.model.find(property);
  }

  async findOne(id: Types.ObjectId): Promise<TModel> {
    const existingData = await this.model.findById(id);
    if (!existingData) {
      throw new NotFoundException(`Id #${id} not found`);
    }
    return existingData;
  }

  async update(id: Types.ObjectId, data: TUpdateDTO): Promise<TModel> {
    const existingData = await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!existingData) {
      throw new NotFoundException(`Id #${id} not found`);
    }
    return existingData;
  }

  async delete(id: Types.ObjectId): Promise<TModel> {
    const deletedRow = await this.model.findByIdAndDelete(id);
    if (!deletedRow) {
      throw new NotFoundException(`Id #${id} not found`);
    }
    return deletedRow;
  }

}
