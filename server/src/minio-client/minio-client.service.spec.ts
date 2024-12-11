import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { File } from './file.model';
import { MinioClientService } from './minio-client.service';


jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid'),
}));

describe('MinioService', () => {
  let service: MinioClientService;
  const baseBucket = 'test-bucket';
  const objectName = 'test-file.txt';
  const file = {
    originalname: objectName,
    buffer: Buffer.from('file content'),
  } as unknown as File;  
  
  const mockMinioService = {
    client: {
      removeObject: jest.fn().mockResolvedValue(undefined),
      statObject: jest.fn().mockResolvedValue(undefined),
      bucketExists: jest.fn().mockResolvedValue(true),
      getObject: jest.fn().mockResolvedValue(undefined),
      makeBucket: jest.fn().mockResolvedValue(undefined),
      putObject: jest.fn().mockResolvedValue(undefined)
    }
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        MINIO_BUCKET: 'test-bucket',
      };
      return config[key];
    }),
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MinioClientService,
        { provide: MinioService, useValue: mockMinioService },
        { provide: ConfigService, useValue: mockConfigService },
      ]
    }).compile();

    service = module.get<MinioClientService>(MinioClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should call putObject successfully', async () => {
      jest.spyOn(service, 'createBucket').mockResolvedValue(undefined);
      const result = await service.upload(file, baseBucket);
      expect(service.createBucket).toHaveBeenCalledWith(baseBucket);
      expect(mockMinioService.client.putObject).toHaveBeenCalledWith(baseBucket, 'mock-uuid-'+objectName, file.buffer);
      expect(result).toBe('mock-uuid-'+objectName);
    });
  });

  describe('createBucket', () => {
    it('should call makeBucket successfully', async () => {
      jest.spyOn(mockMinioService.client,'bucketExists').mockResolvedValue(false);
      await expect(service.createBucket(baseBucket)).resolves.not.toThrow();
      expect(mockMinioService.client.makeBucket).toHaveBeenCalledWith(baseBucket);
    });

    it('should not call makeBucket when bucket exists', async () => {
      jest.spyOn(mockMinioService.client,'bucketExists').mockResolvedValue(true);
      await expect(service.createBucket(baseBucket)).resolves.not.toThrow();
      expect(mockMinioService.client.makeBucket).not.toHaveBeenCalled();
    });
  });

  describe('download', () => {
    it('should call getObject successfully', async () => {
      jest.spyOn(service, 'checkBucketExists').mockResolvedValue(undefined);
      jest.spyOn(service, 'checkObjectExistsInBucket').mockResolvedValue(undefined);
      await expect(service.download(objectName, baseBucket)).resolves.not.toThrow();
      expect(service.checkBucketExists).toHaveBeenCalledWith(baseBucket);
      expect(service.checkObjectExistsInBucket).toHaveBeenCalledWith(objectName, baseBucket);
      expect(mockMinioService.client.getObject).toHaveBeenCalledWith(baseBucket, objectName);
    });

    it('should throw a NotFoundException when bucket not exists', async () => {
      jest.spyOn(service, 'checkBucketExists').mockRejectedValue(new NotFoundException());
      jest.spyOn(service, 'checkObjectExistsInBucket').mockResolvedValue(undefined);
      await expect(service.download(objectName, baseBucket)).rejects.toThrow(NotFoundException);
      expect(service.checkBucketExists).toHaveBeenCalledWith(baseBucket);
      expect(mockMinioService.client.getObject).not.toHaveBeenCalled();
      expect(service.checkObjectExistsInBucket).not.toHaveBeenCalled();
    });

    it('should throw a NotFoundException when object not exists', async () => {
      jest.spyOn(service, 'checkBucketExists').mockResolvedValue(undefined);
      jest.spyOn(service, 'checkObjectExistsInBucket').mockRejectedValue(new NotFoundException());
      await expect(service.download(objectName, baseBucket)).rejects.toThrow(NotFoundException);
      expect(service.checkBucketExists).toHaveBeenCalledWith(baseBucket);
      expect(service.checkObjectExistsInBucket).toHaveBeenCalledWith(objectName, baseBucket);
      expect(mockMinioService.client.getObject).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should call removeObject successfully', async () => {
      jest.spyOn(service, 'checkBucketExists').mockResolvedValue(undefined);
      jest.spyOn(service, 'checkObjectExistsInBucket').mockResolvedValue(undefined);
      await expect(service.delete(objectName, baseBucket)).resolves.not.toThrow();
      expect(service.checkBucketExists).toHaveBeenCalledWith(baseBucket);
      expect(service.checkObjectExistsInBucket).toHaveBeenCalledWith(objectName, baseBucket);
      expect(mockMinioService.client.removeObject).toHaveBeenCalledWith(baseBucket, objectName);
    });

    it('should throw a NotFoundException when bucket not exists', async () => {
      jest.spyOn(service, 'checkBucketExists').mockRejectedValue(new NotFoundException());
      jest.spyOn(service, 'checkObjectExistsInBucket').mockResolvedValue(undefined);
      await expect(service.delete(objectName, baseBucket)).rejects.toThrow(NotFoundException);
      expect(service.checkBucketExists).toHaveBeenCalledWith(baseBucket);
      expect(mockMinioService.client.removeObject).not.toHaveBeenCalled();
      expect(service.checkObjectExistsInBucket).not.toHaveBeenCalled();
    });

    it('should throw a NotFoundException when object not exists', async () => {
      jest.spyOn(service, 'checkBucketExists').mockResolvedValue(undefined);
      jest.spyOn(service, 'checkObjectExistsInBucket').mockRejectedValue(new NotFoundException());
      await expect(service.delete(objectName, baseBucket)).rejects.toThrow(NotFoundException);
      expect(service.checkBucketExists).toHaveBeenCalledWith(baseBucket);
      expect(service.checkObjectExistsInBucket).toHaveBeenCalledWith(objectName, baseBucket);
      expect(mockMinioService.client.removeObject).not.toHaveBeenCalled();
    });
  });

  describe('checkBucketExists', () => {
    it('should call bucketExists successfully', async () => {
      await expect(service.checkBucketExists(baseBucket)).resolves.not.toThrow();
      expect(mockMinioService.client.bucketExists).toHaveBeenCalledWith(baseBucket);
    });

    it('should throw a NotFoundException when bucket not exists', async () => {
      jest.spyOn(mockMinioService.client,'bucketExists').mockResolvedValue(false);
      await expect(service.checkBucketExists(baseBucket)).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkObjectExistsInBucket', () => {
    it('should call statObject successfully', async () => {
      await expect(service.checkObjectExistsInBucket(objectName, baseBucket)).resolves.not.toThrow();
      expect(mockMinioService.client.statObject).toHaveBeenCalledWith(baseBucket, objectName);
    });

    it('should throw a NotFoundException when object not exists', async () => {
      jest.spyOn(mockMinioService.client,'statObject').mockRejectedValue(new NotFoundException());
      await expect(service.checkObjectExistsInBucket(objectName, baseBucket)).rejects.toThrow(NotFoundException);
    });
  });
});
