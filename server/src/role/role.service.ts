import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseService } from '../services/base.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './schemas/role.schema';
import { UpdateRoleDto } from './dto/update-role.dto';


@Injectable()
export class RoleService extends BaseService<Role, CreateRoleDto, UpdateRoleDto> {
  
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {
    super(roleModel);
  }

}
