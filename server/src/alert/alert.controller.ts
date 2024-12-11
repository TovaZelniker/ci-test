import { Controller, Get, Param } from '@nestjs/common';

import { Alert } from './schemas/alert.schema';
import { AlertService } from './alert.service';
import { BaseController } from '../controllers/base.controller';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';


@Controller('alert')
export class AlertController extends BaseController<Alert, CreateAlertDto, UpdateAlertDto> {
  constructor(private readonly alertService: AlertService) {
    super(alertService);
  }

  @Get('/reason/:reason')
  async getByReason(@Param('reason') reason: number) {
    return await this.alertService.getByReason(reason);
  }
}
