import { ExpenseStatus } from 'src/common/types/expense.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrganizationEntity } from './organization.entity';

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

  @Column({ type: 'nvarchar', length: 100, nullable: false })
  Category: string;

  @Column({ type: 'varchar', length: 50, enum: ExpenseStatus, default: ExpenseStatus.PENDING })
  Status: ExpenseStatus;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.Expenses, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'OrganizationId' })
  Organization: OrganizationEntity;
}
