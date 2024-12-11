import mongoose from 'mongoose';

import { WorkflowSchema } from './workflow.schema'; 


const WorkflowModel = mongoose.model('Workflow', WorkflowSchema);

describe('Workflow Schema Validations', () => {
  it('should be invalid if name is missing', () => {
    const workflow = new WorkflowModel({ isShowToCilent:false, authorizedRoles:['id'] });
    const validationError = workflow.validateSync();

    expect(validationError.errors['name']).toBeDefined();
  });

  it('should be invalid if name consists only of spaces', () => {
    const workflow = new WorkflowModel({ name:'  ', isShowToCilent:false, authorizedRoles:['id'] });
    const validationError = workflow.validateSync();
  
    expect(validationError.errors['name']).toBeDefined();
  });

  it('should be invalid if isShowToCilent is missing', () => {
    const workflow = new WorkflowModel({ name:'  ', authorizedRoles:['id'] });
    const validationError = workflow.validateSync();

    expect(validationError.errors['isShowToCilent']).toBeDefined();
  });

  it('should be invalid if authorizedRoles is missimg', () => {
    const workflow = new WorkflowModel({ name:'workflow', isShowToCilent:false });
    const validationError = workflow.validateSync();

    expect(validationError.errors['authorizedRoles']).toBeDefined();
  });

  it('should be invalid if authorizedRoles is empty', () => {
    const workflow = new WorkflowModel({ name:'workflow', isShowToCilent:false, authorizedRoles:[] });
    const validationError = workflow.validateSync();

    expect(validationError.errors['authorizedRoles']).toBeDefined();
    expect(validationError.errors['authorizedRoles'].message).toContain(
      'authorizedRoles must contain at least one element'
    );
  });

  it('should be invalid if deadline is empty', () => {
    const workflow = new WorkflowModel({ name:'workflow', isShowToCilent:false, authorizedRoles:[] });
    const validationError = workflow.validateSync();

    expect(validationError.errors['deadline']).toBeDefined();
  });

  it('should be valid with all properties', () => {
    const workflow = new WorkflowModel({ name:'workflow_name', isShowToCilent:false, authorizedRoles:['id'], deadline:{timing:'1d'} });
    const validationError = workflow.validateSync();

    expect(validationError).toBeUndefined(); 
  });
});
