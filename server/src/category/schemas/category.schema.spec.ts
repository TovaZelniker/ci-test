import mongoose from 'mongoose';

import { CategorySchema } from './category.schema';


const CategoryModel = mongoose.model('Category', CategorySchema);

describe('Category Schema Validations', () => {
  it('should be invalid if name is missing', () => {
    const category = new CategoryModel({ supportedFiles: ['file1.txt'] });
    const validationError = category.validateSync();

    expect(validationError.errors['name']).toBeDefined();
  });

  it('should be invalid if name consists only of spaces', () => {
    const category = new CategoryModel({ name: '   ', supportedFiles: ['file1.txt'] });
    const validationError = category.validateSync();
  
    expect(validationError.errors['name']).toBeDefined();
  });

  it('should be invalid if supportedFiles is missing', () => {
    const category = new CategoryModel({ name: 'test' });
    const validationError = category.validateSync();

    expect(validationError.errors['supportedFiles']).toBeDefined();
  });

  it('should be invalid if supportedFiles is empty', () => {
    const category = new CategoryModel({ name: 'CategoryName', supportedFiles: [] });
    const validationError = category.validateSync();

    expect(validationError.errors['supportedFiles']).toBeDefined();
    expect(validationError.errors['supportedFiles'].message).toContain(
      'supportedFiles must contain at least one element'
    );
  });

  it('should be invalid if supportedFiles has an empty string', () => {
    const category = new CategoryModel({ name: 'CategoryName', supportedFiles: [''] });
    const validationError = category.validateSync();

    expect(validationError.errors['supportedFiles']).toBeDefined();
    expect(validationError.errors['supportedFiles'].message).toContain(
      'File cannot be an empty string'
    );
  });

  it('should be valid with proper name and supportedFiles', () => {
    const category = new CategoryModel({ name: 'CategoryName', supportedFiles: ['file1.txt'] });
    const validationError = category.validateSync();

    expect(validationError).toBeUndefined(); 
  });
});
