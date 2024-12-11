import mongoose from 'mongoose';

import { UserSchema } from './user.schema';


const UserModel = mongoose.model('User', UserSchema);

describe('User Schema Validations', () => {
  it('should be invalid if fields is missing', () => {
    const user = new UserModel({ userID: 'userID' });
    const validationError = user.validateSync();

    expect(validationError.errors['name']).toBeDefined();
    expect(validationError.errors['phone']).toBeDefined();
    expect(validationError.errors['mail']).toBeDefined();
  });
 
  it('should be invalid if required fields consists only of spaces', () => {
    const user = new UserModel({ name: '   ', userID:'userID', phone:'  ', mail:'  ' });
    const validationError = user.validateSync();
  
    expect(validationError.errors['name']).toBeDefined();
    expect(validationError.errors['phone']).toBeDefined();
    expect(validationError.errors['mail']).toBeDefined();
    expect(validationError.errors['rank']).toBeDefined();
  });
 
  it('should be invalid if phone is too short', () => {
    const user = new UserModel({ phone:'05567', mail:'aa@gmail.com'  });
    const validationError = user.validateSync();

    expect(validationError.errors['phone']).toBeDefined();
  });

  it('should be invalid if phone is too long', () => {
    const user = new UserModel({ phone:'0556777777777777', mail:'aa@gmail.com'  });
    const validationError = user.validateSync();

    expect(validationError.errors['phone']).toBeDefined();
  });

  it('should be invalid if phone contains non-numeric characters', () => {
    const user = new UserModel({ phone:'05567a', mail:'aa@gmail.com'  });
    const validationError = user.validateSync();

    expect(validationError.errors['phone']).toBeDefined();
  });

  it('should be invalid if phone contains more than one dash', () => {
    const user = new UserModel({ phone:'055-673-3444', mail:'aa@gmail.com'  });
    const validationError = user.validateSync();

    expect(validationError.errors['phone']).toBeDefined();
  });

  it('should be invalid if phone contains consecutive dashes', () => {
    const user = new UserModel({ phone:'05567--33444', mail:'aa@gmail.com'  });
    const validationError = user.validateSync();

    expect(validationError.errors['phone']).toBeDefined();
  });

  it('should be invalid if phone contains a dash at the beginning of the number', () => {
    const user = new UserModel({ phone:'-0556733444', mail:'aa@gmail.com'  });
    const validationError = user.validateSync();

    expect(validationError.errors['phone']).toBeDefined();
  });

  it('should be invalid if phone contains a dash at the endding of the number', () => {
    const user = new UserModel({ phone:'0556733444-', mail:'aa@gmail.com'  });
    const validationError = user.validateSync();

    expect(validationError.errors['phone']).toBeDefined();
  });

  it('should be invalid if phone contains more than one dot', () => {
    const user = new UserModel({ phone:'055.673.3444', mail:'aa@gmail.com'  });
    const validationError = user.validateSync();

    expect(validationError.errors['phone']).toBeDefined();
  });

  it('should be invalid if phone contains consecutive dots', () => {
    const user = new UserModel({ phone:'05567..33444', mail:'aa@gmail.com'  });
    const validationError = user.validateSync();

    expect(validationError.errors['phone']).toBeDefined();
  });

  it('should be invalid if phone contains a dot at the beginning of the number', () => {
    const user = new UserModel({ phone:'.0556733444', mail:'aa@gmail.com'  });
    const validationError = user.validateSync();

    expect(validationError.errors['phone']).toBeDefined();
  });

  it('should be invalid if phone contains a dot at the endding of the number', () => {
    const user = new UserModel({ phone:'0556733444.', mail:'aa@gmail.com'  });
    const validationError = user.validateSync();

    expect(validationError.errors['phone']).toBeDefined();
  });

  it('should be invalid if phone contains both dot and dash', () => {
    const user = new UserModel({ phone:'055-6733.444', mail:'aa@gmail.com'  });
    const validationError = user.validateSync();

    expect(validationError.errors['phone']).toBeDefined();
  });

  it('should be invalid if mail is missing @ char', () => {
    const user = new UserModel({ mail:'aagmail.com' });
    const validationError = user.validateSync();

    expect(validationError.errors['mail']).toBeDefined();
  });

  it('should be invalid if mail is missing . char', () => {
    const user = new UserModel({ mail:'aa@gmailcom' });
    const validationError = user.validateSync();

    expect(validationError.errors['mail']).toBeDefined();
  });

  it('should be invalid if mail is missing chars befor the suffix', () => {
    const user = new UserModel({ mail:'@gmail.com' });
    const validationError = user.validateSync();

    expect(validationError.errors['mail']).toBeDefined();
  });

  it('should be valid with proper name and supportedFiles', () => {
    const user = new UserModel({ name: 'Name', userID:'userID', phone:'0583205832', mail:'mail33@gmail.com', rank:'rank' });
    const validationError = user.validateSync();

    expect(validationError).toBeUndefined(); 
  });
});
