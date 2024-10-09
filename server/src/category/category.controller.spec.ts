import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;

  const id = '123';
  const testCategory: CategoryDto = { name: 'Updated Category', supportedFiles: [] };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            getAllCategories: jest.fn(),
            getCategoryById:jest.fn(),
            create:jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    categoryController = moduleRef.get<CategoryController>(CategoryController);
    categoryService = moduleRef.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(categoryController).toBeDefined();
  });

  describe('get', () => {
    it('should return an array of categories', async () => {
      const categories = [{ name: 'Category1', supportedFiles: ['test1'] }, { name: 'Category2', supportedFiles: ['test2'] }];
      jest.spyOn(categoryService, 'getAllCategories').mockResolvedValue(categories);
      const result = await categoryController.get();
      expect(result).toEqual(categories);
      expect(categoryService.getAllCategories).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no categories are found', async () => {
      jest.spyOn(categoryService, 'getAllCategories').mockRejectedValue(new NotFoundException());
      await expect(categoryController.get()).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      jest.spyOn(categoryService, 'getAllCategories').mockRejectedValue(new InternalServerErrorException('Unexpected error'));
      await expect(categoryController.get()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getById', () => {
    it('should return a category', async () => {
      jest.spyOn(categoryService, 'getCategoryById').mockResolvedValue(testCategory);
      const result = await categoryController.getById(id);
      expect(result).toEqual(testCategory);
      expect(categoryService.getCategoryById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if category not exist', async () => {
      jest.spyOn(categoryService, 'getCategoryById').mockRejectedValue(new NotFoundException());
      await expect(categoryController.getById(id)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      jest.spyOn(categoryService, 'getCategoryById').mockRejectedValue(new InternalServerErrorException('Unexpected error'));
      await expect(categoryController.getById(id)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('create', () => {
    it('should return the created category', async () => {
      jest.spyOn(categoryService, 'create').mockResolvedValue(testCategory);
      const result = await categoryController.create(testCategory);
      expect(result).toEqual(testCategory);
      expect(categoryService.create).toHaveBeenCalledWith(testCategory);
    });

    it('should throw NotFoundException if category is not found', async () => {
      jest.spyOn(categoryService, 'create').mockRejectedValue(new NotFoundException());
      await expect(categoryController.create(testCategory)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      jest.spyOn(categoryService, 'create').mockRejectedValue(new InternalServerErrorException('Unexpected error'));
      await expect(categoryController.create(testCategory)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should return the updated category', async () => {
      jest.spyOn(categoryService, 'update').mockResolvedValue(testCategory);
      const result = await categoryController.update(id, testCategory);
      expect(result).toEqual(testCategory);
      expect(categoryService.update).toHaveBeenCalledWith(id, testCategory);
    });

    it('should throw NotFoundException if category is not found', async () => {
      jest.spyOn(categoryService, 'update').mockRejectedValue(new NotFoundException());
      await expect(categoryController.update(id, testCategory)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      jest.spyOn(categoryService, 'update').mockRejectedValue(new InternalServerErrorException('Unexpected error'));
      await expect(categoryController.update(id, testCategory)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('delete', () => {
    it('should return the deleted category', async () => {
      jest.spyOn(categoryService, 'delete').mockResolvedValue(testCategory);
      const result = await categoryController.delete(id);
      expect(result).toEqual(testCategory);
      expect(categoryService.delete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if category is not found', async () => {
      jest.spyOn(categoryService, 'delete').mockRejectedValue(new NotFoundException());
      await expect(categoryController.delete(id)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      jest.spyOn(categoryService, 'delete').mockRejectedValue(new InternalServerErrorException('Unexpected error'));
      await expect(categoryController.delete(id)).rejects.toThrow(InternalServerErrorException);
    });
  });

});

