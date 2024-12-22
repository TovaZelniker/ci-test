import { Controller, Get, Param } from '@nestjs/common';
import { Types } from 'mongoose';

import { BaseController } from '../controllers/base.controller';
import { CreateUserProductRoleDto } from './dto/create-user-product-role.dto';
import { UpdateUserProductRoleDto } from './dto/update-user-product-role.dto';
import { UserProductRole } from './schemas/user-product-role.schema';
import { UserProductRoleService } from './user-product-role.service';


@Controller('user-product-role')
export class UserProductRoleController extends BaseController<UserProductRole, CreateUserProductRoleDto, UpdateUserProductRoleDto>{

  constructor(private readonly userProductRoleService: UserProductRoleService) {
    super(userProductRoleService);
  }

  @Get('/product/:productId')
  async getUsersByProduct(@Param('productId') productId: Types.ObjectId) {
    return await this.userProductRoleService.getUsersByProductId(productId);
  }

  @Get('/user/:userId')
  async getProductsByUser(@Param('userId') userId: Types.ObjectId) {
    return await this.userProductRoleService.getProductsByUserId(userId);
  }
}
