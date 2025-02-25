import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RoleEntity } from './role.entity';
import { UserOrganizationEntity } from './user-organization.entity';

@Entity({ name: 'UserOrganizationRole' })
export class UserOrganizationRoleEntity extends BaseEntity {
  @ManyToOne(() => UserOrganizationEntity, (uo) => uo.UserOrganizationRole, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserOrganizationId' })
  UserOrganization: UserOrganizationEntity;

  @ManyToOne(() => RoleEntity, (role) => role.UserOrganizationRole, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'RoleId' })
  Role: RoleEntity;
}
