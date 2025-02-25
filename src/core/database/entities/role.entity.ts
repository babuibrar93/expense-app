import { Column, Entity, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RoleModuleEntity } from './role-module.entity';
import { UserOrganizationRoleEntity } from './user-organization-role.entity';

@Entity({ name: 'Role' })
export class RoleEntity extends BaseEntity {
  @Index({ unique: true }) // Ensures unique role names
  @Column({ type: 'varchar', length: 255, nullable: false })
  Name: string;

  @OneToMany(() => UserOrganizationRoleEntity, (uor) => uor.Role, { cascade: ['remove'] })
  UserOrganizationRole: UserOrganizationRoleEntity[];

  @OneToMany(() => RoleModuleEntity, (rm) => rm.Role, { cascade: ['remove'] })
  RoleModule: RoleModuleEntity[];
}
