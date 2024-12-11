import { BaseDto } from '../../dtos/base.dto';


export class CreateCategoryDto extends BaseDto{
  name: string;
  supportedFiles: string[];
}
