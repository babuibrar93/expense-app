import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrganizationEntity } from './organization.entity';
import { UserOrganizationRoleEntity } from './user-organization-role.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'UserOrganization' })
export class UserOrganizationEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.UserOrganization)
  @JoinColumn({ name: 'UserId' })
  User: UserEntity;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.UserOrganization)
  @JoinColumn({ name: 'OrganizationId' })
  Organization: OrganizationEntity;

  @OneToMany(() => UserOrganizationRoleEntity, (uor) => uor.UserOrganization)
  @JoinColumn({ name: 'RoleId' })
  UserOrganizationRole: UserOrganizationRoleEntity[];
}
