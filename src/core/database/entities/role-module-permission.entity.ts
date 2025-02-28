import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RoleModuleEntity } from './role-module.entity';

@Entity({ name: 'RoleModulePermission' })
export class RoleModulePermissionEntity extends BaseEntity {
  @ManyToOne(() => RoleModuleEntity, (rm) => rm.Permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'RoleModuleId' })
  RoleModule: RoleModuleEntity;

  @Column({ type: 'varchar', length: 255 })
  Permission: string; // e.g., 'READ', 'WRITE', 'DELETE'
}
