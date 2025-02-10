import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RoleModuleEntity } from './role-module.entity';
import { UserOrganizationRoleEntity } from './user-organization-role.entity';

@Entity({ name: 'Role' })
export class RoleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  Name: string;

  @OneToMany(() => UserOrganizationRoleEntity, (uor) => uor.Role)
  UserOrganizationRole: UserOrganizationRoleEntity[];

  @OneToMany(() => RoleModuleEntity, (rm) => rm.Role)
  RoleModule: RoleModuleEntity[];
}
