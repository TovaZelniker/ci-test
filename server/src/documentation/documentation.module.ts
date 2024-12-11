import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DbValidationModule } from '../validation/db-validation.module';
import { Documentation, DocumentationSchema } from './schemas/documentation.schema';
import { DocumentationController } from './documentation.controller';
import { DocumentationService } from './documentation.service';
import { DocumentationValidationMiddleware } from './middleware/documentation-validation.middleware';
import { User, UserSchema } from '../user/schemas/user.schema';


@Module({
  imports: [DbValidationModule ,MongooseModule.forFeature([{name : Documentation.name, schema:DocumentationSchema }, {name : User.name, schema:UserSchema }])],
  controllers: [DocumentationController],
  providers: [DocumentationService]
})
export class DocumentationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DocumentationValidationMiddleware)
      .forRoutes({ path: 'documentation', method: RequestMethod.POST }, { path: 'documentation/:id', method: RequestMethod.PATCH });
  }
}
