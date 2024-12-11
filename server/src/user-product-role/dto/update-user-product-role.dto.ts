import { PartialType } from '@nestjs/mapped-types';

import { CreateUserProductRoleDto } from './create-user-product-role.dto';


export class UpdateUserProductRoleDto extends PartialType(CreateUserProductRoleDto) { }
