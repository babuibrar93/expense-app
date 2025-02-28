import { Injectable } from '@nestjs/common';
import { ModuleEntity } from 'src/core/database/entities/module.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class ModuleRepository extends BaseRepository<ModuleEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, ModuleEntity);
  }

  getORMMethods() {
    return this.getRepository();
  }

  async findOneRecord(conditions: FindOptionsWhere<ModuleEntity>): Promise<ModuleEntity> {
    const where: FindOptionsWhere<ModuleEntity> = { ...conditions };
    return this.getRepository().findOne({ where });
  }
}
