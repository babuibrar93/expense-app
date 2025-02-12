import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserOrganizationRoleEntity } from 'src/core/database/entities/user-organization-role.entity';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserOrganizationRoleRepository extends BaseRepository<UserOrganizationRoleEntity> {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  getORMMethods() {
    return this.getRepository(UserOrganizationRoleEntity);
  }
}
