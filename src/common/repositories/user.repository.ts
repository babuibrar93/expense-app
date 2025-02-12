import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';
import { GeneralError } from '../constants/basic.errors';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  getORMMethods() {
    return this.getRepository(UserEntity);
  }

  async findOneRecord(conditions: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    const where: FindOptionsWhere<UserEntity> = { ...conditions };

    const response = await this.getORMMethods().findOne({ where });

    if (!response) throw new NotFoundException(GeneralError.recordNotFound);
    return response;
  }
}
