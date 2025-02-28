import { Injectable } from '@nestjs/common';
import { RoleModuleEntity } from 'src/core/database/entities/role-module.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Request } from 'express';

@Injectable()
export class RoleModuleRepository extends BaseRepository<RoleModuleEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, RoleModuleEntity);
  }

  getORMMethods(request?: Request) {
    return this.getRepository(request);
  }

  async findOneRecord(
    conditions: FindOptionsWhere<RoleModuleEntity>,
    request?: Request
  ): Promise<RoleModuleEntity> {
    return await this.getRepository(request).findOne({
      where: { ...conditions },
    });
  }
}
