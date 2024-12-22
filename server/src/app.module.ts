import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AlertModule } from './alert/alert.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { DocumentationModule } from './documentation/documentation.module';
import { LoggingModule } from './services/logging/logging.module';
import { MinioClientModule } from './services/minio-client/minio-client.module';
import { ProductModule } from './product/product.module';
import { ProductTypeModule } from './product-type/product-type.module';
import { RoleModule } from './role/role.module';
import { SenderEmailModule } from './services/sender-email/sender-email.module';
import { UserModule } from './user/user.module';
import { UserProductRoleModule } from './user-product-role/user-product-role.module';
import { WorkflowModule } from './workflow/workflow.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AlertModule, CategoryModule, DocumentationModule, LoggingModule, MinioClientModule, ProductModule, ProductTypeModule,
    RoleModule, SenderEmailModule, UserModule, UserProductRoleModule, WorkflowModule],
  controllers: [AppController],
  providers: [AppService] 
})
export class AppModule { }
