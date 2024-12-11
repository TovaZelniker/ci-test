import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { BaseService } from '../services/base.service';
import { CreateUserProductRoleDto } from './dto/create-user-product-role.dto';
import { UpdateUserProductRoleDto } from './dto/update-user-product-role.dto';
import { UserProductRole } from './schemas/user-product-role.schema';

@Injectable()
export class UserProductRoleService extends BaseService<UserProductRole, CreateUserProductRoleDto, UpdateUserProductRoleDto> {

  constructor(@InjectModel(UserProductRole.name) private userProductRoleModel: Model<UserProductRole>) {
    super(userProductRoleModel);
  }

  async getByUser(user: Types.ObjectId){
    //TODO use findByParameter function from base
    return `need to return all products relevant to ${user} user`;
  }

  async getByProduct(product: Types.ObjectId){
    //TODO use findByParameter function from base
    return `need to return all users relevant to ${product} product`;
  }

}
