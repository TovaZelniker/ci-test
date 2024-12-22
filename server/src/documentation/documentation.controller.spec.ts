import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { DbValidationService } from '../validation/db-validation.service';
import { DocumentationController } from './documentation.controller';
import { DocumentationService } from './documentation.service';
import { DocumentationValidationPipe } from './pipes/documentation-validation.pipe';
import { File } from '../services/minio-client/file.model';
import { User } from '../user/schemas/user.schema';


describe('DocumentationController', () => {
  let controller: DocumentationController;
  let service: DocumentationService;

  const testDocumentation = {
    productId: new Types.ObjectId(),
    content: '',
    editedBy: new Types.ObjectId(),
    isManualChange: false,
    type: 1,
    date: null
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentationController],
      providers: [
        {
          provide: DocumentationService,
          useValue: {
            create: jest.fn().mockResolvedValue(testDocumentation),
            delete: jest.fn().mockResolvedValue(testDocumentation)
          }
        },
        {
          provide: DbValidationService,
          useValue: {validate: jest.fn()}
        },
        {
          provide: getModelToken(User.name),
          useValue: {find: jest.fn()},
        },
        DocumentationValidationPipe
      ],
    }).compile();

    controller = module.get<DocumentationController>(DocumentationController);
    service = module.get<DocumentationService>(DocumentationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return the created documentation', async () => {
      const file = {
        originalname: 'name',
        buffer: Buffer.from('file content'),
      } as File;  
      const result = await controller.create(testDocumentation, file);
      expect(result).toEqual(testDocumentation);
      expect(service.create).toHaveBeenCalledWith(testDocumentation, file);
    });
  });

  describe('delete', () => {
    it('should return the deleted documentation', async () => {
      const id = new Types.ObjectId();
      const result = await controller.delete(id);
      expect(result).toEqual(testDocumentation);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
