import { Controller } from '@nestjs/common';

import { BaseController } from '../controllers/base.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';


@Controller('user')
export class UserController extends BaseController<User, CreateUserDto, UpdateUserDto> {

  constructor(private readonly userService: UserService) {
    super(userService);
  }
  
}
