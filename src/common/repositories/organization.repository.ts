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
    relation?: { relations: boolean },
    request?: any
  ): Promise<OrganizationEntity> {
    const where: FindOptionsWhere<OrganizationEntity> = { ...conditions };
    const relations = relation?.relations
      ? ['UserOrganization', 'UserOrganization.User', 'UserOrganization.UserOrganizationRole', 'UserOrganization.UserOrganizationRole.Role']
      : [];
    return await this.getRepository(request).findOne({ where, relations });
  }
}
