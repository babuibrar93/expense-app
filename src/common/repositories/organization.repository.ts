import { Injectable } from '@nestjs/common';
import { OrganizationEntity } from 'src/core/database/entities/organization.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class OrganizationRepository extends BaseRepository<OrganizationEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, OrganizationEntity);
  }

  getORMMethods(request?: any) {
    return this.getRepository(request);
  }

  async findOneRecord(
    conditions: FindOptionsWhere<OrganizationEntity>,
    request?: any
  ): Promise<OrganizationEntity> {
    const where: FindOptionsWhere<OrganizationEntity> = { ...conditions };
    return await this.getRepository(request).findOne({ where });
  }
}
