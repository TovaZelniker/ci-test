import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from './../src/app.module';
import { LoggingService } from '../src/services/logging/logging.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    const URI = mongoServer.getUri();
    const mockConfigService = {
      get: jest.fn((key: string) => {
        const mockEnv = {
          MINIO_ENDPOINT: 'minio',
          MINIO_PORT: '9000',
          MINIO_SSL: 'false',
          MINIO_ACCESSKEY: 'test-access-key',
          MINIO_SECRETKEY: 'test-secret-key',
        };
        return mockEnv[key];
      }),
    };

    // Mocking LoggingService
    const mockLoggingService = {
      writeToLog: jest.fn(),
    };
    

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(URI), AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .overrideProvider(LoggingService)
      .useValue(mockLoggingService) // Use mocked LoggingService
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
