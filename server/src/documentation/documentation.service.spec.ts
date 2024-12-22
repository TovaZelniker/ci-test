import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { BaseService } from '../services/base/base.service';
import { Documentation } from './schemas/documentation.schema';
import { DocumentationService } from './documentation.service';
import { File } from '../services/minio-client/file.model';
import { MinioClientService } from '../services/minio-client/minio-client.service';


describe('DocumentationService', () => {
  let service: DocumentationService;
  let minioClientService: MinioClientService;

  const fileName = 'file-name';
  const bucketName = 'bucket-name';
  const id = new Types.ObjectId();
  const mockDocumentation = {
    productId: new Types.ObjectId(),
    content: '',
    editedBy: new Types.ObjectId(),
    isManualChange: false,
    type: 1,
    date: null
  };

  const foundDocumentation = {
    productId: new Types.ObjectId(),
    fileName: fileName
  };

  const file = {
    originalname: 'name',
    buffer: Buffer.from('file content'),
  } as File; 
  
  const mockDocumentationModel = {
    create: jest.fn().mockResolvedValue(mockDocumentation),
    findByIdAndDelete: jest.fn().mockResolvedValue(mockDocumentation),
    findById: jest.fn().mockResolvedValue(foundDocumentation)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentationService,
        { 
          provide: getModelToken(Documentation.name),
          useValue: mockDocumentationModel },
        {
          provide: MinioClientService,
          useValue: {upload: jest.fn(), delete: jest.fn()}
        }
      ],
    }).compile();

    service = module.get<DocumentationService>(DocumentationService);
    minioClientService = module.get<MinioClientService>(MinioClientService);
    jest.spyOn(service, 'uploadFile').mockResolvedValue(fileName);
    jest.spyOn(service, 'deleteFile').mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return created documentation with file uploaded', async () => {
      const result = await service.create(mockDocumentation, file);      
      expect(result).toEqual(mockDocumentation);
      expect(service.uploadFile).toHaveBeenCalledWith(file, mockDocumentation.productId.toString());      
      expect(mockDocumentationModel.create).toHaveBeenCalledWith({
        ...mockDocumentation,
        content: file.originalname,
        fileName,
      });
    });

    it('should return created documentation with out file uploaded', async () => {
      const result = await service.create(mockDocumentation);      
      expect(result).toEqual(mockDocumentation);
      expect(service.uploadFile).not.toHaveBeenCalled();
      expect(mockDocumentationModel.create).toHaveBeenCalledWith(mockDocumentation);
    });

    it('should delete the uploaded file on error', async () => {
      jest.spyOn(mockDocumentationModel, 'create').mockRejectedValue(new InternalServerErrorException('Unexpected error'));
      await expect(service.create(mockDocumentation, file)).rejects.toThrow(); 
      expect(service.uploadFile).toHaveBeenCalledWith(file, mockDocumentation.productId.toString());
      expect(service.deleteFile).toHaveBeenCalledWith(fileName, mockDocumentation.productId.toString());      
    });
    
    it('should not call deleteFile on error without file supported', async () => {
      jest.spyOn(mockDocumentationModel, 'create').mockRejectedValue(new InternalServerErrorException('Unexpected error'));      
      await expect(service.create(mockDocumentation)).rejects.toThrow(); 
      expect(service.uploadFile).not.toHaveBeenCalled();
      expect(service.deleteFile).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should return deleted documentation row', async () => {
      jest.spyOn(service, 'checkIsDocumentationFile').mockReturnThis();
      const result = await service.delete(id);      
      expect(result).toEqual(mockDocumentation);
      expect(service.deleteFile).toHaveBeenCalledWith(foundDocumentation.fileName, foundDocumentation.productId.toString());      
      expect(service.checkIsDocumentationFile).toHaveBeenCalledWith(foundDocumentation);      
      expect(mockDocumentationModel.findById).toHaveBeenCalledWith(id);
    });

    it('should recreate the record if file deletion fails and throw an error', async () => {
      const mockId = new Types.ObjectId();
      const mockDocumentation = {
        _id: mockId,
        fileName: 'mock-file.txt',
        productId: 'mock-product-id',
        toObject: jest.fn(() => ({ _id: mockId, fileName: 'mock-file.txt', productId: 'mock-product-id' })),
      };
      const error = new Error('File deletion failed');
      jest.spyOn(service, 'findOne').mockResolvedValue(mockDocumentation as any);
      jest.spyOn(service, 'checkIsDocumentationFile').mockImplementation(() => {});
      const mockDelete = jest.spyOn(BaseService.prototype, 'delete').mockResolvedValue(mockDocumentation);
      const mockCreate = jest.spyOn(BaseService.prototype, 'create').mockResolvedValue(mockDocumentation);
      jest.spyOn(service, 'deleteFile').mockRejectedValue(error);
      await expect(service.delete(mockId)).rejects.toThrow(error);
      expect(mockDelete).toHaveBeenCalledWith(mockId);
      expect(service.deleteFile).toHaveBeenCalledWith(mockDocumentation.fileName, mockDocumentation.productId);
      expect(mockCreate).toHaveBeenCalledWith(mockDocumentation.toObject());
    });

    it('should not recreate on error in checkIsDocumentationFile function', async () => {
      jest.spyOn(service, 'checkIsDocumentationFile').mockImplementation(() => {
        throw new InternalServerErrorException('Unexpected error');
      });
      await expect(service.delete(id)).rejects.toThrow(); 
      expect(mockDocumentationModel.create).not.toHaveBeenCalled();
    });

    it('should not recreate on error find the row', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new InternalServerErrorException('Unexpected error'));      
      await expect(service.delete(id)).rejects.toThrow(); 
      expect(mockDocumentationModel.create).not.toHaveBeenCalled();
    });
  });

  describe('checkIsDocumentationFile', () => {
    it('should not throw an error if fileName is provided', async () => {
      expect(() => service.checkIsDocumentationFile({fileName:'test'} as any)).not.toThrow();
    });

    it('should throw BadRequestException if fileName is not provided', () => {
      expect(() => service.checkIsDocumentationFile({} as any)).toThrow(BadRequestException);
    });
  });

  describe('uploadFile', () => {
    it('should call minioClientService upload function', async () => {
      jest.spyOn(service, 'uploadFile').mockRestore();
      await service.uploadFile(file, bucketName);
      expect(minioClientService.upload).toHaveBeenCalledWith(file, bucketName);
    });
  });

  describe('deleteFile', () => {
    it('should call minioClientService delete function', async () => {
      jest.spyOn(service, 'deleteFile').mockRestore();
      await service.deleteFile(fileName, bucketName);
      expect(minioClientService.delete).toHaveBeenCalledWith(fileName, bucketName);
    });
  });
});
