import { Injectable } from '@nestjs/common';
import { UserOrganizationEntity } from 'src/core/database/entities/user-organization.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserOrganizationRepository extends BaseRepository<UserOrganizationEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, UserOrganizationEntity);
  }

  getORMMethods(request?: any) {
    return this.getRepository(request);
  }

  findOneRecord(
    conditions: FindOptionsWhere<UserOrganizationEntity>,
    request?: any
  ): Promise<UserOrganizationEntity> {
    return this.getRepository(request).findOne({ where: conditions });
  }
}
