import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { Alert } from './schemas/alert.schema';
import { AlertService } from './alert.service';


const mockAlert = {
  _id: '1',
  alertReason: 1,
  recipients: [],
  content: 'abc'
};

const mockAlertModel = {
  find: jest.fn().mockReturnThis(),
  populate: jest.fn().mockResolvedValue([mockAlert]),
  exec: jest.fn().mockResolvedValue([mockAlert]),
};

describe('AlertService', () => {
  let service: AlertService;
  let model: Model<Alert>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertService,
        {
          provide: getModelToken('Alert'),
          useValue: mockAlertModel,
        }
      ]
    }).compile();

    service = module.get<AlertService>(AlertService);
    model = module.get<Model<Alert>>(getModelToken('Alert'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of alerts', async () => {
      const result = await service.findAll();

      expect(result).toEqual([mockAlert]);
      expect(model.find).toHaveBeenCalled();
      expect(model.populate).toHaveBeenCalledWith({
        path: 'recipients',
        model: 'Role',
      });
    });
  });

  describe('getByReason', () => {
    it('should return alerts filtered by reason', async () => {
      const reason = 1;
      const result = await service.getByReason(reason);

      expect(result).toEqual([mockAlert]);
      expect(model.find).toHaveBeenCalledWith({ alertReason: reason });
      expect(model.populate).toHaveBeenCalledWith({
        path: 'recipients',
        model: 'Role',
      });
    });
  });

});


