import { Test, TestingModule } from '@nestjs/testing';
import { LoggingService } from './logging.service';
import * as fs from 'fs';
import * as util from 'util';

jest.mock('fs');

describe('LoggingService', () => {
  let service: LoggingService;
  let mockWriteStream: fs.WriteStream;

  beforeEach(async () => {
    mockWriteStream = {
      write: jest.fn(),
    } as unknown as fs.WriteStream;

    jest.spyOn(fs, 'createWriteStream').mockReturnValue(mockWriteStream);

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingService],
    }).compile();

    service = module.get<LoggingService>(LoggingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should write a formatted error message to the log file', () => {
    const errorMessage = 'Test error message';
    const mockDate = new Date('2024-01-01T00:00:00Z');

    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

    service.writeToLog(errorMessage);

    expect(mockWriteStream.write).toHaveBeenCalledTimes(2);
    expect(mockWriteStream.write).toHaveBeenNthCalledWith(1, `${mockDate}\n`);
    expect(mockWriteStream.write).toHaveBeenNthCalledWith(2, `${util.format(errorMessage)}\n\n`);
  });
});
