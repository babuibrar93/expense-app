import { Injectable } from '@nestjs/common';
import { RoleEntity } from 'src/core/database/entities/role.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';
@Injectable()
export class RoleRepository extends BaseRepository<RoleEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, RoleEntity);
  }

  getORMMethods() {
    return this.getRepository();
  }

  async findOneRecord(conditions: FindOptionsWhere<RoleEntity>): Promise<RoleEntity> {
    const where: FindOptionsWhere<RoleEntity> = { ...conditions };
    return await this.getORMMethods().findOne({ where });
  }
}
