import {
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity as TypeOrmBaseEntity,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export class BaseEntity extends TypeOrmBaseEntity {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @Index()
  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'CreatedBy' })
  CreatedBy: UserEntity;

  @Index()
  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'DeletedBy' })
  DeletedBy: UserEntity;

  @Index()
  @CreateDateColumn({ type: 'datetime2' })
  CreatedAt: Date;

  @UpdateDateColumn({ type: 'datetime2', nullable: true })
  UpdatedAt: Date;

  @DeleteDateColumn({ type: 'datetime2', nullable: true })
  DeletedAt: Date;
}
