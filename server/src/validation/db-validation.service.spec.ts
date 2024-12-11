import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { DbValidationService } from './db-validation.service';


describe('DbValidationService', () => {
  let service: DbValidationService;
  let model: Model<any>;
  const ids = [new Types.ObjectId(), new Types.ObjectId()];
  const documents = [{},{}];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbValidationService],
    }).compile();

    service = module.get<DbValidationService>(DbValidationService);
    model = { find: jest.fn() } as any; 
  });

  it('should pass validation if all IDs exist', async () => {
    jest.spyOn(model, 'find').mockResolvedValue(documents);
    await expect(service.validateObjectIds(ids, model, 'authorizedRoles')).resolves.not.toThrow();
  });

  it('should throw NotFoundException if any ID does not exist', async () => {
    jest.spyOn(model, 'find').mockResolvedValue([documents[0]]); 
    await expect(service.validateObjectIds(ids, model, 'authorizedRoles')).rejects.toThrow(NotFoundException);
  });
});
