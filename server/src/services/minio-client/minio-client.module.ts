import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { Module } from '@nestjs/common';

import { MinioClientService } from './minio-client.service';


@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        endPoint: configService.get<string>('MINIO_ENDPOINT'),
        port: +configService.get<string>('MINIO_PORT'),
        useSSL: configService.get<string>('MINIO_SSL') == 'true',
        accessKey: configService.get<string>('MINIO_ACCESSKEY'),
        secretKey: configService.get<string>('MINIO_SECRETKEY')
      })
    })
  ],
  providers: [MinioClientService],
  exports: [MinioClientService]
})
export class MinioClientModule { }
