import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './schemas/category.schema';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryModel: Model<Category>;

  const id = '123';
  const testCategory = { name: 'Updated Category', supportedFiles: [] };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getModelToken('Category'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn()
          },
        },
      ],
    }).compile();

    categoryService = moduleRef.get<CategoryService>(CategoryService);
    categoryModel = moduleRef.get<Model<Category>>(getModelToken('Category'));
  });

  it('should be defined', () => {
    expect(categoryService).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('should return an array of categories', async () => {
      const categories = [{ name: 'Category1' }, { name: 'Category2' }];
      jest.spyOn(categoryModel, 'find').mockResolvedValue(categories as any);
      const result = await categoryService.getAllCategories();
      expect(result).toEqual(categories);
    });

    it('should throw NotFoundException if no categories are found', async () => {
      jest.spyOn(categoryModel, 'find').mockResolvedValue([]);
      await expect(categoryService.getAllCategories()).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      jest.spyOn(categoryModel, 'find').mockRejectedValue(new InternalServerErrorException('Unexpected error'));
      await expect(categoryService.getAllCategories()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      jest.spyOn(categoryModel, 'findById').mockResolvedValue(testCategory as any);
      const result = await categoryService.getCategoryById(id);
      expect(result).toEqual(testCategory);
      expect(categoryModel.findById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if no category by id', async () => {
      jest.spyOn(categoryModel, 'findById').mockResolvedValue(null);
      await expect(categoryService.getCategoryById(id)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      jest.spyOn(categoryModel, 'findById').mockRejectedValue(new InternalServerErrorException('Unexpected error'));
      await expect(categoryService.getCategoryById(id)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getCategoriesByIds', () => {
    it('should return an array of categories', async () => {
      const categories = [
        { _id: '1', name: 'Category 1' },
        { _id: '2', name: 'Category 2' },
      ];
      jest.spyOn(categoryModel, 'find').mockResolvedValue(categories as any);
      const result = await categoryService.getCategoriesByIds(['1', '2']);
      expect(result).toEqual(categories);
      expect(categoryModel.find).toHaveBeenCalledWith({ '_id': { $in: ['1', '2'] } });
    });

    it('should throw NotFoundException if no category by id', async () => {
      jest.spyOn(categoryModel, 'find').mockResolvedValue(null);
      await expect(categoryService.getCategoriesByIds(['1', '2'])).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      jest.spyOn(categoryModel, 'find').mockRejectedValue(new InternalServerErrorException('Unexpected error'));
      await expect(categoryService.getCategoriesByIds(['1', '2'])).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('create', () => {
    it('should return created category', async () => {
      jest.spyOn(categoryModel, 'create').mockResolvedValue(testCategory as any);
      const result = await categoryService.create(testCategory);
      expect(result).toEqual(testCategory);
      expect(categoryModel.create).toHaveBeenCalledWith(testCategory);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      jest.spyOn(categoryModel, 'create').mockRejectedValue(new InternalServerErrorException('Unexpected error'));
      await expect(categoryService.create(testCategory)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should return updated category', async () => {
      jest.spyOn(categoryModel, 'findByIdAndUpdate').mockResolvedValue(testCategory as any);
      const result = await categoryService.update(id, testCategory);
      expect(result).toEqual(testCategory);
      expect(categoryModel.findByIdAndUpdate).toHaveBeenCalledWith(id, testCategory, { new: true });
    });

    it('should throw NotFoundException if no category by id', async () => {
      jest.spyOn(categoryModel, 'findByIdAndUpdate').mockResolvedValue(null);
      await expect(categoryService.update(id, testCategory)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      jest.spyOn(categoryModel, 'findByIdAndUpdate').mockRejectedValue(new InternalServerErrorException('Unexpected error'));
      await expect(categoryService.update(id, testCategory)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('delete', () => {
    it('should return deleted category', async () => {
      jest.spyOn(categoryModel, 'findByIdAndDelete').mockResolvedValue(testCategory as any);
      const result = await categoryService.delete(id);
      expect(result).toEqual(testCategory);
      expect(categoryModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if no category by id', async () => {
      jest.spyOn(categoryModel, 'findByIdAndDelete').mockResolvedValue(null);
      await expect(categoryService.delete(id)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      jest.spyOn(categoryModel, 'findByIdAndDelete').mockRejectedValue(new InternalServerErrorException('Unexpected error'));
      await expect(categoryService.delete(id)).rejects.toThrow(InternalServerErrorException);
    });
  });

});
