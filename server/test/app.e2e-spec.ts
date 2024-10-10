import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(''), AppModule],
    }).overrideProvider(MongooseModule)
    .useValue({}).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});


// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import { AppModule } from './../src/app.module';
// import { MongooseModule } from '@nestjs/mongoose';
// import { closeInMongodConnection, rootMongooseTestModule } from '@server/utils/mongo'; // Import helper functions for in-memory MongoDB testing

// describe('AppController (e2e)', () => {
//   let app: INestApplication;
//   let moduleFixture: TestingModule;

//   beforeAll(async () => {
//     moduleFixture = await Test.createTestingModule({
//       imports: [rootMongooseTestModule(), AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   afterAll(async () => {
//     await app.close();
//     await closeInMongodConnection(); // Close the in-memory MongoDB connection
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });
// });
