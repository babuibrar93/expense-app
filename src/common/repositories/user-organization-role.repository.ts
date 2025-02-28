import { Injectable } from '@nestjs/common';
import { UserOrganizationRoleEntity } from 'src/core/database/entities/user-organization-role.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserOrganizationRoleRepository extends BaseRepository<UserOrganizationRoleEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, UserOrganizationRoleEntity);
  }

  getORMMethods(request?: any) {
    return this.getRepository(request);
  }

  findOneRecord(
    conditions: FindOptionsWhere<UserOrganizationRoleEntity>,
    request?: any
  ): Promise<UserOrganizationRoleEntity> {
    return this.getRepository(request).findOne({ where: conditions });
  }
}
