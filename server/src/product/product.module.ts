import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DbValidationModule } from '../validation/db-validation.module';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductService } from './product.service';
import {
  ProductType,
  ProductTypeSchema,
} from '../product-type/schemas/product-type.schema';
import { ProductValidationMiddleware } from './middleware/product-validation.middleware';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    DbValidationModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductType.name, schema: ProductTypeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProductValidationMiddleware)
      .forRoutes(
        { path: 'product', method: RequestMethod.POST },
        { path: 'product/:id', method: RequestMethod.PATCH },
      );
  }
}
