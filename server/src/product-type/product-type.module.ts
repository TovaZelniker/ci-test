import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Category, CategorySchema } from '../category/schemas/category.schema';
import { DbValidationModule } from '../validation/db-validation.module';
import { ProductType, ProductTypeSchema } from './schemas/product-type.schema';
import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';
import { ProductTypeValidation } from './middleware/product-type-validation.middleware';
import { Workflow, WorkflowSchema } from '../workflow/schemas/workflow.schema';


@Module({
  imports: [DbValidationModule , MongooseModule.forFeature([
    { name: ProductType.name, schema: ProductTypeSchema },
    { name: Workflow.name, schema: WorkflowSchema },
    { name: Category.name, schema: CategorySchema }])],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
})
export class ProductTypeModule {
  
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProductTypeValidation)
      .forRoutes({ path: 'productType', method: RequestMethod.POST }, { path: 'productType/:id', method: RequestMethod.PATCH });
  }
}
