import { Types } from 'mongoose';

import { BaseDto } from '../../dtos/base.dto';


export class CreateAlertDto extends BaseDto{
  alertReason: number;
  recipients: Types.ObjectId[];
  content: string;
}
