import { Injectable } from '@nestjs/common';
import { UserOrganizationEntity } from 'src/core/database/entities/user-organization.entity';
import { EntityManager } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserOrganizationRepository extends BaseRepository<UserOrganizationEntity> {
  constructor(manager: EntityManager) {
    super(UserOrganizationEntity, manager);
  }
}
