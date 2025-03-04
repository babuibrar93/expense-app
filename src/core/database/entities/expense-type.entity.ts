import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('ExpenseType')
export class ExpenseTypeEntity extends BaseEntity {
  @Column({ type: 'nvarchar', length: 100, nullable: false, unique: true })
  Name: string;
}
