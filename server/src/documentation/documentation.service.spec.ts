import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { Documentation } from './schemas/documentation.schema';
import { DocumentationService } from './documentation.service';


describe('DocumentationService', () => {
  let service: DocumentationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentationService,
        { provide: getModelToken(Documentation.name), useValue: Model },
      ],
    }).compile();

    service = module.get<DocumentationService>(DocumentationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
