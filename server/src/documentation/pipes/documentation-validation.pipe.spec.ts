import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateDocumentationDto } from '../dto/create-documentation.dto';
import { DbValidationService } from '../../validation/db-validation.service';
import { DocumentationValidationPipe } from './documentation-validation.pipe';
import { UserDocument } from '../../user/schemas/user.schema';


describe('UserValidationPipe', () => {
  let dbValidationService: DbValidationService;
  let pipe: DocumentationValidationPipe;
  let userModel: Model<UserDocument>;

  const mockRequest: CreateDocumentationDto = {
    productId: new Types.ObjectId(),
    content: '',
    editedBy: new Types.ObjectId(),
    isManualChange: false,
    type: 1,
    date: null
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentationValidationPipe,
        {
          provide: DbValidationService,
          useValue: { validateObjectIds: jest.fn() },
        },
        {
          provide: 'UserModel',
          useValue: { find: jest.fn() },
        },
      ],
    }).compile();

    dbValidationService = module.get<DbValidationService>(DbValidationService);
    pipe = module.get<DocumentationValidationPipe>(DocumentationValidationPipe);    
    userModel = module.get<Model<UserDocument>>('UserModel');
  });

  it('should return data if all IDs exist', async () => {
    jest.spyOn(dbValidationService, 'validateObjectIds').mockResolvedValue(undefined);
    const result = await pipe.transform(mockRequest);
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledWith(
      [mockRequest.editedBy], userModel, 'editedBy');
    expect(dbValidationService.validateObjectIds).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockRequest);
  });

  it('should throw NotFoundException if any ID does not exist', async () => {
    jest.spyOn(dbValidationService, 'validateObjectIds').mockRejectedValue(
      new NotFoundException('One or more IDs do not exist')
    );
    await expect(pipe.transform(mockRequest)).rejects.toThrow(
      NotFoundException,
    );
  });
});
