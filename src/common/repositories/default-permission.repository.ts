import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';
import { DefaultPermissionEntity } from 'src/core/database/entities/default-permission.entity';

@Injectable()
export class DefaultPermissionRepository extends BaseRepository<DefaultPermissionEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, DefaultPermissionEntity);
  }

  getORMMethods() {
    return this.getRepository();
  }

  async findOneRecord(
    conditions: FindOptionsWhere<DefaultPermissionEntity>
  ): Promise<DefaultPermissionEntity> {
    const where: FindOptionsWhere<DefaultPermissionEntity> = { ...conditions };
    return await this.getORMMethods().findOne({ where });
  }
}
