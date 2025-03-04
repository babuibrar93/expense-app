import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ExpenseTypeEntity } from './expense-type.entity';

@Entity('ExpenseCategory')
export class ExpenseCategoryEntity extends BaseEntity {
  @Column({ type: 'nvarchar', length: 255, nullable: false, unique: true })
  Name: string;

  @ManyToOne(() => ExpenseTypeEntity, { eager: true, nullable: false })
  @JoinColumn({ name: 'TypeId' })
  Type: ExpenseTypeEntity;
}
