import mongoose, { Types } from 'mongoose';

import { DocumentationSchema } from './documentation.schema';
import { DocumentationType } from './documentation-type.enum';


const DocumentationModel = mongoose.model('Documentation', DocumentationSchema);

describe('Documentation Schema Validations', () => {

  it('should be invalid if properties are missing', () => {
    const documentation = new DocumentationModel({ });
    const validationError = documentation.validateSync();

    expect(validationError.errors['productId']).toBeDefined();
    expect(validationError.errors['content']).toBeDefined();
    expect(validationError.errors['editedBy']).toBeDefined();
    expect(validationError.errors['isManualChange']).toBeDefined();    
    expect(validationError.errors['type']).toBeDefined();
    expect(validationError.errors['date']).toBeDefined();
  });

  it('should be invalid if content consists only of spaces', () => {
    const documentation = new DocumentationModel({ content: '   ' });
    const validationError = documentation.validateSync();
  
    expect(validationError.errors['content']).toBeDefined();
  });

  it('should be invalid if type is invalid enum value', () => {
    const documentation = new DocumentationModel({ type: 999 });
    const validationError = documentation.validateSync();

    expect(validationError.errors['type']).toBeDefined();
  });
 
  it('should be valid ', () => {
    const documentation = new DocumentationModel({productId: new Types.ObjectId(), content:'content', date: new Date(), editedBy: new Types.ObjectId(), isManualChange:true, type:DocumentationType.remark });
    const validationError = documentation.validateSync();

    expect(validationError).toBeUndefined(); 
  });
});
