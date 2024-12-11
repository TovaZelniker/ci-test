import mongoose from 'mongoose';

import { DeadlineSchema } from './deadline.schema'; 


const DeadlineModel = mongoose.model('Deadline', DeadlineSchema);
const invalidTimingMessage = 'Timing must be a number (integer or decimal) followed by "m" for months or "d" for days, e.g., "1m" or "5d"';

describe('Deadline Schema Validations', () => {
  it('should be invalid if timing is missing', () => {
    const deadline = new DeadlineModel({ dependentWorkflow:['id'] });
    const validationError = deadline.validateSync();

    expect(validationError.errors['timing']).toBeDefined();
  });

  it('should be invalid if name consists only of spaces', () => {
    const deadline = new DeadlineModel({ timing:'  ', dependentWorkflow:['id'] });
    const validationError = deadline.validateSync();
  
    expect(validationError.errors['timing']).toBeDefined();
  });

  it('should be invalid if time timing is missing the m or d suffix', () => {
    const deadline = new DeadlineModel({ timing:'1', dependentWorkflow:['id'] });
    const validationError = deadline.validateSync();

    expect(validationError.errors['timing']).toBeDefined();
    expect(validationError.errors['timing'].message).toContain(invalidTimingMessage);
  });

  it('should be invalid if time timing has an invalid suffix', () => {
    const deadline = new DeadlineModel({ timing:'1y', dependentWorkflow:['id'] });
    const validationError = deadline.validateSync();

    expect(validationError.errors['timing']).toBeDefined();
    expect(validationError.errors['timing'].message).toContain(invalidTimingMessage);
  });

  it('should be valid without dependentWorkflow', () => {
    const deadline = new DeadlineModel({ timing:'1d'});
    const validationError = deadline.validateSync();

    expect(validationError).toBeUndefined(); 
  });

  it('should be valid with valid timing in days', () => {
    const deadline = new DeadlineModel({ timing:'1d', dependentWorkflow:['id'] });
    const validationError = deadline.validateSync();

    expect(validationError).toBeUndefined(); 
  });

  it('should be valid with valid timing in months', () => {
    const deadline = new DeadlineModel({ timing:'1m', dependentWorkflow:['id'] });
    const validationError = deadline.validateSync();

    expect(validationError).toBeUndefined(); 
  });
});
