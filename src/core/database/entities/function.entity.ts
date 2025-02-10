import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ModuleEntity } from './module.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'Function' })
export class FunctionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  Name: string;

  @ManyToOne(() => ModuleEntity, (module) => module.Functions, { onDelete: 'CASCADE' })
  Module: ModuleEntity;
}
