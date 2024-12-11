import mongoose from 'mongoose';

import { RoleSchema } from './role.schema';


const RoleModel = mongoose.model('Role', RoleSchema);

describe('Role Schema Validations', () => {
  it('should be invalid if name is missing', () => {
    const role = new RoleModel({ });
    const validationError = role.validateSync();

    expect(validationError.errors['name']).toBeDefined();
  });

  it('should be invalid if name consists only of spaces', () => {
    const role = new RoleModel({ name:'   ' });
    const validationError = role.validateSync();
  
    expect(validationError.errors['name']).toBeDefined();
  });
  
  it('should be valid with valid name', () => {
    const role = new RoleModel({ name:'role' });
    const validationError = role.validateSync();

    expect(validationError).toBeUndefined(); 
  });
});
