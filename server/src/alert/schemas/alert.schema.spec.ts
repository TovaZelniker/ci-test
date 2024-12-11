import mongoose from 'mongoose';

import { AlertSchema } from './alert.schema';


const AlertModel = mongoose.model('Alert', AlertSchema);

describe('Alert Schema Validations', () => {
  it('should be invalid if alertReason is missing', () => {
    const alert = new AlertModel({ recipients: ['id'], content: 'abc' });
    const validationError = alert.validateSync();

    expect(validationError.errors['alertReason']).toBeDefined();
  });

  it('should be invalid if alertReason not in enum range', () => {
    const alert = new AlertModel({ alertReason: 50, recipients: ['id'], content: 'abc' });
    const validationError = alert.validateSync();

    expect(validationError.errors['alertReason']).toBeDefined();
  });

  it('should be invalid if recipients is missimg', () => {
    const alert = new AlertModel({ alertReason: 1, content: 'abc' });
    const validationError = alert.validateSync();

    expect(validationError.errors['recipients']).toBeDefined();
  });

  it('should be invalid if recipients is empty', () => {
    const alert = new AlertModel({ alertReason: 1, recipients: [], content: 'abc' });
    const validationError = alert.validateSync();

    expect(validationError.errors['recipients']).toBeDefined();
  });

  it('should be invalid if content is missimg', () => {
    const alert = new AlertModel({ alertReason: 1, recipients: ['id'] });
    const validationError = alert.validateSync();

    expect(validationError.errors['content']).toBeDefined();
  });

  it('should be invalid if content is empty', () => {
    const alert = new AlertModel({ alertReason: 1, recipients: ['id'], content: '' });
    const validationError = alert.validateSync();

    expect(validationError.errors['content']).toBeDefined();
  });

  it('should be invalid if content is string of space', () => {
    const alert = new AlertModel({ alertReason: 1, recipients: ['id'], content: ' ' });
    const validationError = alert.validateSync();

    expect(validationError.errors['content']).toBeDefined();
  });

});