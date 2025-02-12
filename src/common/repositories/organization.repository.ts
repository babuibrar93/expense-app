import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { OrganizationEntity } from 'src/core/database/entities/organization.entity';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class OrganizationRepository extends BaseRepository<OrganizationEntity> {
  constructor(@Inject(REQUEST) req: Request, dataSource: DataSource) {
    super(dataSource, req);
  }

  getORMMethods() {
    return this.getRepository(OrganizationEntity);
  }
}
