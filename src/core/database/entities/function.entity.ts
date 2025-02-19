import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ModuleEntity } from './module.entity';

@Entity({ name: 'Function' })
export class FunctionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  Name: string;

  @ManyToOne(() => ModuleEntity, (module) => module.Functions, { onDelete: 'CASCADE' })
  Module: ModuleEntity;
}
