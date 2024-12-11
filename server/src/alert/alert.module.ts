import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Alert, AlertSchema } from './schemas/alert.schema';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { AlertValidationMiddleware } from './middleware/alert-validation.middleware';
import { DbValidationModule } from '../validation/db-validation.module';
import { Role, RoleSchema } from '../role/schemas/role.schema';


@Module({
  imports: [DbValidationModule, MongooseModule.forFeature([{ name: Alert.name, schema: AlertSchema }, { name: Role.name, schema: RoleSchema }])],
  controllers: [AlertController],
  providers: [AlertService],
})

export class AlertModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AlertValidationMiddleware)
      .forRoutes({ path: 'alert', method: RequestMethod.POST }, { path: 'alert/:id', method: RequestMethod.PATCH });
  }
}
