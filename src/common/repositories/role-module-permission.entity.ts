import { Injectable } from '@nestjs/common';
import { RoleModulePermissionEntity } from 'src/core/database/entities/role-module-permission.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Request } from 'express';

@Injectable()
export class RoleModulePermissionRepository extends BaseRepository<RoleModulePermissionEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, RoleModulePermissionEntity);
  }

  getORMMethods(request?: Request) {
    return this.getRepository(request);
  }

  async findOneRecord(
    conditions: FindOptionsWhere<RoleModulePermissionEntity>,
    request?: Request
  ): Promise<RoleModulePermissionEntity> {
    return await this.getRepository(request).findOne({
      where: { ...conditions },
    });
  }
}
