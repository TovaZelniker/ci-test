import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DbValidationModule } from '../validation/db-validation.module';
import { Role, RoleSchema } from '../role/schemas/role.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { UserProductRole, UserProductRoleSchema } from './schemas/user-product-role.schema';
import { UserProductRoleController } from './user-product-role.controller';
import { UserProductRoleService } from './user-product-role.service';
import { UserProductRoleValidationMiddleware } from './middleware/user-product-role-validation.middleware';
import { Workflow, WorkflowSchema } from '../workflow/schemas/workflow.schema';


@Module({
  imports: [DbValidationModule, MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }, { name: User.name, schema: UserSchema }, { name: UserProductRole.name, schema: UserProductRoleSchema }, { name: Workflow.name, schema: WorkflowSchema }])],
  controllers: [UserProductRoleController],
  providers: [UserProductRoleService],
})
export class UserProductRoleModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserProductRoleValidationMiddleware)
      .forRoutes({ path: 'user-product-role', method: RequestMethod.POST }, { path: 'user-product-role/:id', method: RequestMethod.PATCH });
  }
}
