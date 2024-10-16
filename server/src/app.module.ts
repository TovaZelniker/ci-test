import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI), CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
