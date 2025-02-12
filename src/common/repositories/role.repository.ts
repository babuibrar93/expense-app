import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RoleEntity } from 'src/core/database/entities/role.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { GeneralError } from '../constants/basic.errors';
import { BaseRepository } from './base.repository';
@Injectable()
export class RoleRepository extends BaseRepository<RoleEntity> {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  getORMMethods() {
    return this.getRepository(RoleEntity);
  }

  async findOneRecord(conditions: FindOptionsWhere<RoleEntity>): Promise<RoleEntity> {
    const where: FindOptionsWhere<RoleEntity> = { ...conditions };

    const response = await this.getORMMethods().findOne({ where });

    if (!response) throw new NotFoundException(GeneralError.recordNotFound);
    return response;
  }
}
