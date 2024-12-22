import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DbValidationModule } from '../validation/db-validation.module';
import { Documentation, DocumentationSchema } from './schemas/documentation.schema';
import { DocumentationController } from './documentation.controller';
import { DocumentationService } from './documentation.service';
import { DocumentationValidationPipe } from './pipes/documentation-validation.pipe';
import { MinioClientModule } from '../services/minio-client/minio-client.module';
import { User, UserSchema } from '../user/schemas/user.schema';


@Module({
  imports: [DbValidationModule, MinioClientModule, MongooseModule.forFeature([{name : Documentation.name, schema:DocumentationSchema }, {name : User.name, schema:UserSchema }])],
  controllers: [DocumentationController],
  providers: [DocumentationService, DocumentationValidationPipe]
})
export class DocumentationModule { }
