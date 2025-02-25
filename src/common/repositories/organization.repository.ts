import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { OrganizationEntity } from 'src/core/database/entities/organization.entity';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class OrganizationRepository extends BaseRepository<OrganizationEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, OrganizationEntity);
  }

  getORMMethods() {
    return this.getRepository();
  }
}
