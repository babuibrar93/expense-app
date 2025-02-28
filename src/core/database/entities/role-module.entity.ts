import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ModuleEntity } from './module.entity';
import { RoleEntity } from './role.entity';
import { RoleModulePermissionEntity } from './role-module-permission.entity';

@Entity({ name: 'RoleModule' })
export class RoleModuleEntity extends BaseEntity {
  @ManyToOne(() => RoleEntity, (role) => role.RoleModule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'RoleId' })
  Role: RoleEntity;

  @ManyToOne(() => ModuleEntity, (module) => module.RoleModule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ModuleId' })
  Module: ModuleEntity;

  @OneToMany(() => RoleModulePermissionEntity, (rmp) => rmp.RoleModule)
  Permissions: RoleModulePermissionEntity[];
}
