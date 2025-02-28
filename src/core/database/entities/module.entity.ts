import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RoleModuleEntity } from './role-module.entity';
import { FunctionEntity } from './function.entity';

@Entity({ name: 'Module' })
export class ModuleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  Name: string;

  @Column({ type: 'nvarchar', length: 255, nullable: false, unique: true })
  ModuleCode: string;

  @OneToMany(() => RoleModuleEntity, (rm) => rm.Module)
  RoleModule: RoleModuleEntity[];

  @OneToMany(() => FunctionEntity, (func) => func.Module)
  Functions: FunctionEntity[];

  @ManyToOne(() => ModuleEntity, (module) => module.SubModules, { nullable: true })
  @JoinColumn({ name: 'ParentId' })
  ParentModule: ModuleEntity | null;

  @OneToMany(() => ModuleEntity, (module) => module.ParentModule)
  SubModules: ModuleEntity[];
}
