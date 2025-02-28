import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, UserEntity);
  }

  getORMMethods(request?: any) {
    return this.getRepository(request);
  }

  async findOneRecord(
    conditions: FindOptionsWhere<UserEntity>,
    relations?: { relations: boolean },
    request?: any
  ): Promise<UserEntity> {
    return await this.getRepository(request).findOne({
      where: { ...conditions },
      relations: relations?.relations
        ? [
            'UserOrganization',
            'UserOrganization.Organization',
            'UserOrganization.UserOrganizationRole',
            'UserOrganization.UserOrganizationRole.Role',
          ]
        : [],
    });
  }
}
