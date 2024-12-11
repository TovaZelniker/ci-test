import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DbValidationService } from './db-validation.service';
import { Role, RoleSchema } from '../role/schemas/role.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  providers: [DbValidationService],
  exports: [DbValidationService],
})
export class DbValidationModule {}
