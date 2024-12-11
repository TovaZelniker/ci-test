import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DbValidationModule } from '../validation/db-validation.module';
import { Role, RoleSchema } from '../role/schemas/role.schema';
import { Workflow, WorkflowSchema } from './schemas/workflow.schema';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { WorkflowValidationMiddleware } from './middleware/workflow-validation.middleware';


@Module({
  imports: [DbValidationModule , MongooseModule.forFeature([{ name: Workflow.name, schema: WorkflowSchema }, { name: Role.name, schema: RoleSchema }])],
  controllers: [WorkflowController],
  providers: [WorkflowService],
})
export class WorkflowModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WorkflowValidationMiddleware)
      .forRoutes({ path: 'workflow', method: RequestMethod.POST }, { path: 'workflow/:id', method: RequestMethod.PATCH });
  }
}
