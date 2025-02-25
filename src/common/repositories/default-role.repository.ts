import { Injectable } from '@nestjs/common';
import { DefaultRoleEntity } from 'src/core/database/entities/default-role.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class DefaultRoleRepository extends BaseRepository<DefaultRoleEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, DefaultRoleEntity);
  }

  getORMMethods() {
    return this.getRepository();
  }

  async findOneRecord(conditions: FindOptionsWhere<DefaultRoleEntity>): Promise<DefaultRoleEntity> {
    const where: FindOptionsWhere<DefaultRoleEntity> = { ...conditions };
    return await this.getORMMethods().findOne({ where });
  }
}
