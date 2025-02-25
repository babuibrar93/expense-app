import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { DataSource, FindOptionsWhere, QueryRunner } from 'typeorm';
import { BaseRepository } from './base.repository';
import { GeneralError } from '../constants/basic.errors';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, UserEntity);
  }

  getORMMethods() {
    return this.getRepository();
  }

  async findOneRecord(
    conditions: FindOptionsWhere<UserEntity>,
    relations?: { relations: boolean }
  ): Promise<UserEntity> {
    return await this.getRepository().findOne({
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
