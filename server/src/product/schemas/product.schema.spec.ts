import mongoose, { Types } from 'mongoose';

import { ProductSchema } from './product.schema';


const ProductModel = mongoose.model('Product', ProductSchema);

const createProduct = (overrides = {}) => {
  return new ProductModel({
    name: 'Product Name',
    openRequest: new Date(),
    orderBranch: 'Branch',
    orderSection: 'Section',
    orderCourse: 'Course',
    summary: 'Summary',
    purpose: 'Purpose',
    projector: new Types.ObjectId(),
    contentSpecialist: new Types.ObjectId(),
    productType: new Types.ObjectId(),
    deadline: new Date(),
    status: [],
    mandatoryCategories: [],
    optionalCategories: [],
    ...overrides, 
  });
};

describe('Product Schema Validations', () => {
  it('should be invalid if name is missing', () => {
    const product = createProduct({
      name: undefined,
    });
    const validationError = product.validateSync();
    expect(validationError.errors['name']).toBeDefined();
  });

  it('should be invalid if cancellationOrDelayReason is not in enum range', () => {
    const product = createProduct({
      cancellationOrDelayReason: 99,
    });
    const validationError = product.validateSync();
    expect(validationError.errors['cancellationOrDelayReason']).toBeDefined();
  });

  it('should set openRequest to the current date by default', () => {
    const product = createProduct();
    const validationError = product.validateSync();
    expect(validationError).toBeUndefined();
    expect(product.openRequest).toBeDefined();
      
    const expectedDate = new Date().toISOString().split('.')[0]; 
    const productDate = new Date(product.openRequest).toISOString().split('.')[0];
    
    expect(productDate).toEqual(expectedDate);
  });
    
  it('should be invalid if projector is missing', () => {
    const product = createProduct({
      projector: undefined 
    });
    const validationError = product.validateSync();
    expect(validationError.errors['projector']).toBeDefined();
  });

  it('should be invalid if contentSpecialist is missing', () => {
    const product = createProduct({ 
      contentSpecialist: undefined 
    });
    const validationError = product.validateSync();
    expect(validationError.errors['contentSpecialist']).toBeDefined();
  });

  it('should be invalid if productType is missing', () => {
    const product = createProduct({
      productType: undefined 
    });
    const validationError = product.validateSync();
    expect(validationError.errors['productType']).toBeDefined();
  });

  it('should be invalid if mandatoryCategories is missing', async () => {
    const product = createProduct({ 
      mandatoryCategories: undefined 
    });
    try {
      await product.validate();
    } catch (validationError) {
      expect(validationError.errors['mandatoryCategories']).toBeDefined();
    }
  });

  it('should be invalid if optionalCategories is missing', async () => {
    const product = createProduct({
      optionalCategories: undefined
    });
    try {
      await product.validate();
    } catch (validationError) {
      expect(validationError.errors['optionalCategories']).toBeDefined();
    }
  });

  it('should be invalid if deadline is missing', () => {
    const product = createProduct({ 
      deadline: undefined 
    });
    const validationError = product.validateSync();
    expect(validationError.errors['deadline']).toBeDefined();
  });

  it('should be invalid if mandatoryCategories structure is wrong', async () => {
    const product = createProduct({
      mandatoryCategories: [{ categoryId: new Types.ObjectId(), files: ['file1'] }],
      optionalCategories: [{ categoryId: new Types.ObjectId(), files: ['file2'] }],
    });
    try {
      await product.validate();
    } catch (validationError) {
      expect(validationError.errors['mandatoryCategories.0.files']).toBeDefined();
      expect(validationError.errors['mandatoryCategories.0.categoryId']).toBeDefined();
    }
  });

  it('should be invalid if status structure is wrong', () => {
    const product = createProduct({
      status: [{}],
      mandatoryCategories: [{ categoryId: new Types.ObjectId(), files: 'file1' }],
    });
      
    const validationError = product.validateSync();
    expect(validationError.errors['status.0.workflowStatus']).toBeDefined();
    expect(validationError.errors['status.0.isCompleted']).toBeDefined();
  });
});

