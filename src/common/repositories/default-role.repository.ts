import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DefaultRoleEntity } from 'src/core/database/entities/default-role.entity';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class DefaultRoleRepository extends BaseRepository<DefaultRoleEntity> {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  getORMMethods() {
    return this.getRepository(DefaultRoleEntity);
  }
}
