import { Injectable } from '@nestjs/common';
import { RoleEntity } from 'src/core/database/entities/role.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';
@Injectable()
export class RoleRepository extends BaseRepository<RoleEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, RoleEntity);
  }

  getORMMethods(request?: any) {
    return this.getRepository(request);
  }

  async findOneRecord(
    conditions: FindOptionsWhere<RoleEntity>,
    request?: any
  ): Promise<RoleEntity> {
    const where: FindOptionsWhere<RoleEntity> = { ...conditions };
    return this.getRepository(request).findOne({ where });
  }
}
