import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { BaseService } from './base.service';


describe('BaseService', () => {
  let service: BaseService<any, any, any>;
  const data = [{ name: 'Test' }];
  const id = new Types.ObjectId();
  const item = { _id: id, name: 'Test' };
  const populatedData = [{ _id: id, name: 'Test', relatedModel: { _id: id, name: 'Related' } }];

  const mockModel = {
    create: jest.fn().mockResolvedValue(item),
    find: jest.fn().mockReturnValue(data),
    findById: jest.fn().mockResolvedValue(item),
    findByIdAndUpdate: jest.fn().mockResolvedValue(item),
    findByIdAndDelete: jest.fn().mockResolvedValue(item),
    populate: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BaseService,
          useFactory: () => new BaseService(mockModel as any),
        },
      ],
    }).compile();

    service = module.get<BaseService<any, any, any>>(BaseService);
  });

  describe('create', () => {
    it('should create an item', async () => {
      expect(await service.create(item)).toEqual(item);
      expect(mockModel.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all items', async () => {
      expect(await service.findAll()).toEqual(data);
      expect(mockModel.find).toHaveBeenCalled();
    });
  });

  describe('findByProperty', () => {
    const property = { name: 'Test' };
    const path = 'relatedModel';
    const model = 'RelatedModel';

    it('should return items with populated data when path and model are provided', async () => {
      mockModel.find.mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(populatedData) });
      const result = await service.findByProperty(property, path, model);

      expect(result).toEqual(populatedData);
      expect(mockModel.find).toHaveBeenCalledWith(property);
    });

    it('should return items without populated data when path and model are not provided', async () => {
      const result = await service.findByProperty(property);

      expect(result).toEqual(data);
      expect(mockModel.find).toHaveBeenCalledWith(property);
      expect(mockModel.populate).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find an item by id', async () => {
      expect(await service.findOne(id)).toEqual(item);
      expect(mockModel.findById).toHaveBeenCalled();
    });

    it('should throw NotFoundException when item not found by id', async () => {
      mockModel.findById.mockResolvedValue(null);
      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      expect(await service.update(id, item)).toEqual(item);
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(id, item, { new: true, runValidators: true });
    });

    it('should throw NotFoundException when updating non-existing item', async () => {
      mockModel.findByIdAndUpdate.mockResolvedValue(null);
      await expect(service.update(id, item)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an item', async () => {
      expect(await service.delete(id)).toEqual(item);
      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when deleting non-existing item', async () => {
      mockModel.findByIdAndDelete.mockResolvedValue(null);
      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
    });
  });

});