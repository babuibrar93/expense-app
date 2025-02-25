import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserOrganizationEntity } from 'src/core/database/entities/user-organization.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserOrganizationRepository extends BaseRepository<UserOrganizationEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, UserOrganizationEntity);
  }

  getORMMethods() {
    return this.getRepository();
  }

  findOneRecord(
    conditions: FindOptionsWhere<UserOrganizationEntity>
  ): Promise<UserOrganizationEntity> {
    return this.getORMMethods().findOne({ where: conditions });
  }
}
