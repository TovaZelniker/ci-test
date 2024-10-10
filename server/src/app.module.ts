import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [process.env.MONGO_URI !== 'test'
  ? MongooseModule.forRoot(process.env.MONGO_URI)
  : MongooseModule.forRoot('mongodb://localhost/test'),
CategoryModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
