import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, concatMap, finalize } from 'rxjs';
import { DataSource } from 'typeorm';
import { ENTITY_MANAGER_KEY } from '../constants/basic.constant';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    // get request object
    const req = context.switchToHttp().getRequest<Request>();
    // start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // attach query manager with transaction to the request
    req[ENTITY_MANAGER_KEY] = queryRunner.manager;
    console.log('Enter here');
    return next.handle().pipe(
      // concatMap gets called when route handler completes successfully
      concatMap(async (data) => {
        console.log('Enter here in commit');

        await queryRunner.commitTransaction();
        return data;
      }),
      // catchError gets called when route handler throws an exception
      catchError(async (e) => {
        console.log('Enter here in rollback');

        await queryRunner.rollbackTransaction();
        throw e;
      }),
      // always executed, even if catchError method throws an exception
      finalize(async () => {
        console.log('Enter here in release');

        await queryRunner.release();
      })
    );
  }
}
