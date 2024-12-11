import { Types } from 'mongoose';

import { BaseDto } from '../../../dtos/base.dto';
import { CreateDeadlineDto } from '../deadline/create-deadline.dto';


export class CreateWorkflowDto extends BaseDto {
  name: string;
  isShowToCilent: boolean;
  authorizedRoles: Types.ObjectId[];
  deadline: CreateDeadlineDto;
}
