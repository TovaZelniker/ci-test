import { BaseDto } from '../../dtos/base.dto';


export class CreateUserDto extends BaseDto{
  userID: string;
  name: string;
  phone: string;
  rank: string;
  mail: string;
}
