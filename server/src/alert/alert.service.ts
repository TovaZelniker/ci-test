import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Alert } from './schemas/alert.schema';
import { BaseService } from '../services/base.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';


@Injectable()
export class AlertService extends BaseService<Alert, CreateAlertDto, UpdateAlertDto> {

  constructor(@InjectModel(Alert.name) private alertModel: Model<Alert>) {
    super(alertModel);
  }

  async findAll(): Promise<Alert[]> {
    return await this.alertModel.find().populate({
      path: 'recipients',
      model: 'Role',
    });
  }

  async getByReason(reason: number) {
    return await this.findByProperty({ alertReason: reason }, 'recipients', 'Role');
  }

}
