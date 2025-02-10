import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { EntityManager } from 'typeorm';
import { RoleEntity } from 'src/core/database/entities/role.entity';

@Injectable()
export class RoleRepository extends BaseRepository<RoleEntity> {
  constructor(manager: EntityManager) {
    super(RoleEntity, manager);
  }
}
