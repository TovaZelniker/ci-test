import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { BaseService } from '../services/base/base.service';
import { CreateUserProductRoleDto } from './dto/create-user-product-role.dto';
import { UpdateUserProductRoleDto } from './dto/update-user-product-role.dto';
import { UserProductRole } from './schemas/user-product-role.schema';


@Injectable()
export class UserProductRoleService extends BaseService<UserProductRole, CreateUserProductRoleDto, UpdateUserProductRoleDto> {

  constructor(@InjectModel(UserProductRole.name) private userProductRoleModel: Model<UserProductRole>) {
    super(userProductRoleModel);
  }

  async getProductsByUserId(userId: Types.ObjectId) {
    return await this.findByProperty({ userId: userId }, 'productId', 'Product');
  }

  async getUsersByProductId(productId: Types.ObjectId) {
    return await this.findByProperty({ productId: productId }, 'userId', 'User');
  }
}
