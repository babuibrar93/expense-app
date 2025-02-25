import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserOrganizationRoleEntity } from 'src/core/database/entities/user-organization-role.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserOrganizationRoleRepository extends BaseRepository<UserOrganizationRoleEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, UserOrganizationRoleEntity);
  }

  getORMMethods() {
    return this.getRepository();
  }

  findOneRecord(
    conditions: FindOptionsWhere<UserOrganizationRoleEntity>
  ): Promise<UserOrganizationRoleEntity> {
    return this.getORMMethods().findOne({ where: conditions });
  }
}
