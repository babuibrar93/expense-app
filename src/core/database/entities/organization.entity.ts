import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserOrganizationEntity } from './user-organization.entity';

@Entity({ name: 'Organization' })
export class OrganizationEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  Name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  Description: string;

  @OneToMany(() => UserOrganizationEntity, (uo) => uo.Organization)
  UserOrganization: UserOrganizationEntity[];
}
