import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { MongooseError } from 'mongoose';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Observable, catchError, throwError } from 'rxjs';


@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        switch (true) {
        case error instanceof MongooseError:
        case error instanceof MongoServerError:
        case error instanceof BadRequestException:
          return throwError(() => new BadRequestException(error.message));
        case error instanceof NotFoundException:
          return throwError(() => new NotFoundException(error.message));
        default:
          return throwError(() => new InternalServerErrorException(error.message));
        }
      }),
    );
  }
}