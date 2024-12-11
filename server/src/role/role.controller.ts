import { Controller } from '@nestjs/common';

import { BaseController } from '../controllers/base.controller';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './schemas/role.schema';
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dto/update-role.dto';


@Controller('role')
export class RoleController extends BaseController<Role, CreateRoleDto, UpdateRoleDto> {

  constructor(private readonly roleService: RoleService) {
    super(roleService);
  }

}
