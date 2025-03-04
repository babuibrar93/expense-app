import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrganizationEntity } from './organization.entity';
import { ExpenseTypeEntity } from './expense-type.entity';
import { ExpenseCategoryEntity } from './expense-category.entity';
import { ExpenseStatus } from 'src/common/types/expense.enum';

@Entity('Expense')
export class ExpenseEntity extends BaseEntity {
  @Column({ type: 'nvarchar', length: 255, nullable: false })
  Title: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  Description: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: false })
  Amount: number;

  @Column({ type: 'nvarchar', length: 50, nullable: false })
  Currency: string;

  @Column({ type: 'date', nullable: false })
  ExpenseDate: Date;

  @Column({ type: 'varchar', length: 50, enum: ExpenseStatus, default: ExpenseStatus.PENDING })
  Status: ExpenseStatus;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.Expenses, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'OrganizationId' })
  Organization: OrganizationEntity;

  @ManyToOne(() => ExpenseTypeEntity, { eager: true, nullable: false })
  @JoinColumn({ name: 'TypeId' })
  Type: ExpenseTypeEntity;

  @ManyToOne(() => ExpenseCategoryEntity, { eager: true, nullable: false })
  @JoinColumn({ name: 'CategoryId' })
  Category: ExpenseCategoryEntity;
}
