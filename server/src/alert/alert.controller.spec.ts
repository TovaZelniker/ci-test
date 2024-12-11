import { Test, TestingModule } from '@nestjs/testing';

import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';


describe('AlertController', () => {
  let alertController: AlertController;
  let alertService: AlertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertController],
      providers: [
        {
          provide: AlertService,
          useValue: { getByReason: jest.fn((reason: number) => `Alert reason: ${reason}`) },
        },
      ],
    }).compile();

    alertController = module.get<AlertController>(AlertController);
    alertService = module.get<AlertService>(AlertService);
  });

  it('should be defined', () => {
    expect(alertController).toBeDefined();
  });

  describe('getByReason', () => {
    it('should return a alert by reason', async () => {
      const reason = 1;
      expect(await alertController.getByReason(reason)).toEqual(`Alert reason: ${reason}`);
      expect(alertService.getByReason).toHaveBeenCalledWith(reason);
    });
  });

});
