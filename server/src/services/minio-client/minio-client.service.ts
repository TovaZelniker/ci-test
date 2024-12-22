import { ConfigService } from '@nestjs/config';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';

import { File } from './file.model';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class MinioClientService {
  private readonly bucketName;

  constructor( 
    private configService: ConfigService,
    private readonly minio: MinioService ) { 
    this.bucketName = this.configService.get<string>('MINIO_BUCKET');
  }

  public get client() {
    return this.minio.client;
  }

  public async upload(file: File, bucketName: string = this.bucketName) {
    await this.createBucket(bucketName);
    const fileName = `${uuidv4()}-${file.originalname}`;
    this.client.putObject(bucketName, fileName, file.buffer);
    return fileName;
  }

  public async createBucket(bucketName: string = this.bucketName){
    const bucketExists = await this.client.bucketExists(bucketName);
    if(!bucketExists){ 
      this.client.makeBucket(bucketName);
    }
  }

  public async download(fileName: string, bucketName: string = this.bucketName) {
    await this.checkBucketExists(bucketName);
    await this.checkObjectExistsInBucket(fileName, bucketName);
    return await this.client.getObject(bucketName, fileName);
  }

  async delete(fileName: string, bucketName: string = this.bucketName) {
    await this.checkBucketExists(bucketName);
    await this.checkObjectExistsInBucket(fileName, bucketName);
    await this.client.removeObject(bucketName, fileName);
  }

  async checkBucketExists(bucketName: string = this.bucketName){
    const bucketExists = await this.client.bucketExists(bucketName);
    if(!bucketExists){
      throw new NotFoundException('Bucket not exist');
    }
  }

  async checkObjectExistsInBucket(fileName: string, bucketName: string = this.bucketName){
    try {
      await this.client.statObject(bucketName, fileName);
    }
    catch {
      throw new NotFoundException('Object not exist in the bucket');
    }
  }

}
