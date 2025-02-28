import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';
import { ExpenseEntity } from 'src/core/database/entities/expense.entity';

@Injectable()
export class ExpenseRepository extends BaseRepository<ExpenseEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, ExpenseEntity);
  }

  getORMMethods() {
    return this.getRepository();
  }

  async findOneRecord(conditions: FindOptionsWhere<ExpenseEntity>): Promise<ExpenseEntity> {
    const where: FindOptionsWhere<ExpenseEntity> = { ...conditions };
    return await this.getORMMethods().findOne({ where });
  }
}
