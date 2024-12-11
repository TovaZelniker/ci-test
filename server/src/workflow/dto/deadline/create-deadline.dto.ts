import { Types } from 'mongoose';


export class CreateDeadlineDto {
  timing: string;
  dependentWorkflow: Types.ObjectId;
}
