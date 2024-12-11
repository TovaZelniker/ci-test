import mongoose from 'mongoose';

import { ProductTypeSchema } from './product-type.schema';


const ProductTypeModel = mongoose.model('ProductType', ProductTypeSchema);

describe('ProductType Schema Validations', () => {
  it('should be invalid if name is missing', () => {
    const productType = new ProductTypeModel({ mandatoryCategories: ['id1'], optionalCategories: ['id2'], workflow: ['id3'],});
    const validationError = productType.validateSync();

    expect(validationError.errors['name']).toBeDefined();
  });

  it('should be invalid if name consists only of spaces', () => {
    const productType = new ProductTypeModel({ name: '   ', mandatoryCategories: ['id1'], optionalCategories: ['id2'], workflow: ['id3'],});
    const validationError = productType.validateSync();
  
    expect(validationError.errors['name']).toBeDefined();
  });
  
  it('should be invalid if mandatoryCategories is empty', () => {
    const productType = new ProductTypeModel({ name: 'test', mandatoryCategories:[],  optionalCategories: ['id2'], workflow: ['id3'],});
    const validationError = productType.validateSync();

    expect(validationError.errors['mandatoryCategories']).toBeDefined();
    expect(validationError.errors['mandatoryCategories'].message).toContain(
      'mandatoryCategories must contain at least one element'
    );
  });

  it('should be invalid if workflow is empty', () => {
    const productType = new ProductTypeModel({ name: 'test', mandatoryCategories:['id1'],  optionalCategories: ['id2'], workflow: [],});
    const validationError = productType.validateSync();

    expect(validationError.errors['workflow']).toBeDefined();
    expect(validationError.errors['workflow'].message).toContain(
      'workflow must contain at least one element'
    );
  });

  it('should be invalid if optionalCategories is not defined', () => {
    const productType = new ProductTypeModel({ name: 'test', mandatoryCategories:['id1'], workflow: [],});
    const validationError = productType.validateSync();

    expect(validationError.errors['optionalCategories']).toBeDefined();
  });

  it('should be valid all properties', () => {
    const productType = new ProductTypeModel({ name: 'name', mandatoryCategories: ['id1'], optionalCategories: [], workflow: ['id3'],});
    const validationError = productType.validateSync();

    expect(validationError).toBeUndefined(); 
  });

});
