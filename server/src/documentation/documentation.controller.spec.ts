import { Test, TestingModule } from '@nestjs/testing';

import { DocumentationController } from './documentation.controller';
import { DocumentationService } from './documentation.service';
import { mockServiceMethods } from '../test-utils/mock-service';


describe('DocumentationController', () => {
  let controller: DocumentationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentationController],
      providers: [
        {
          provide: DocumentationService,
          useValue: mockServiceMethods
        },
      ],
    }).compile();

    controller = module.get<DocumentationController>(DocumentationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
