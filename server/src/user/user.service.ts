import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseService } from '../services/base/base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';


@Injectable()
export class UserService extends BaseService<User, CreateUserDto, UpdateUserDto>{

  constructor(@InjectModel(User.name) private categoryModel: Model<User>) {
    super(categoryModel);
  }

}
