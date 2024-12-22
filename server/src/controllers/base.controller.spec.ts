import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { BaseController } from './base.controller';
import { BaseService } from '../services/base/base.service';
import { mockServiceMethods } from '../test-utils/mock-service';


describe('BaseController', () => {
  let controller: BaseController<any, any, any>;
  const item = { name: 'Test' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaseController],
      providers: [
        {
          provide: BaseService,
          useValue: mockServiceMethods
        },
      ],
    }).compile();

    controller = module.get<BaseController<any, any, any>>(BaseController);
  });

  describe('create', () => {
    it('should create an item', async () => {
      expect(await controller.create(item)).toEqual(item);
    });
  });

  describe('findAll', () => {
    it('should return all items', async () => {
      expect(await controller.findAll()).toEqual([item]);
    });
  });

  describe('findOne', () => {
    it('should return one item by id', async () => {
      expect(await controller.findOne(new Types.ObjectId())).toEqual(item);
    });
  });
  
  describe('update', () => {
    it('should update an item', async () => {
      expect(await controller.update(new Types.ObjectId(), item)).toEqual(item);
    });
  });

  describe('delete', () => {
    it('should delete an item', async () => {
      expect(await controller.delete(new Types.ObjectId())).toEqual(item);
    });
  });
  
});
