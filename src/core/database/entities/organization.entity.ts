import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserOrganizationEntity } from './user-organization.entity';
import { ExpenseEntity } from './expense.entity';

@Entity({ name: 'Organization' })
export class OrganizationEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  Name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  Email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Phone: string;

  @Column({ type: 'text', nullable: true })
  Address: string;

  @Column({ type: 'text', nullable: true })
  Description: string;

  @OneToMany(() => UserOrganizationEntity, (uo) => uo.Organization)
  UserOrganization: UserOrganizationEntity[];

  @OneToMany(() => ExpenseEntity, (e) => e.Organization)
  Expenses: ExpenseEntity;
}
