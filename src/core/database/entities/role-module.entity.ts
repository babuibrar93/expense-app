import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ModuleEntity } from './module.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'RoleModule' })
export class RoleModuleEntity extends BaseEntity {
  @ManyToOne(() => RoleEntity, (role) => role.RoleModule)
  @JoinColumn({ name: 'RoleId' })
  Role: RoleEntity;

  @ManyToOne(() => ModuleEntity, (module) => module.RoleModule)
  @JoinColumn({ name: 'ModuleId' })
  Module: ModuleEntity;
}
