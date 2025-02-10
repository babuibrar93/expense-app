import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { OrganizationEntity } from 'src/core/database/entities/organization.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class OrganizationRepository extends BaseRepository<OrganizationEntity> {
  constructor(manager: EntityManager) {
    super(OrganizationEntity, manager);
  }
}
