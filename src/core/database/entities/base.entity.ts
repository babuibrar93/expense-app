  import {
    CreateDateColumn,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    BaseEntity as TypeOrmBaseEntity,
    UpdateDateColumn
  } from 'typeorm';
  import { UserEntity } from './user.entity';

  export class BaseEntity extends TypeOrmBaseEntity {
    @Index()
    @PrimaryGeneratedColumn('uuid')
    Id: string; 

    @Index()
    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({ name: 'CreatedBy' }) 
    CreatedBy: UserEntity | string;

    @Index()
    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({ name: 'DeletedBy' }) 
    DeletedBy: UserEntity | string;

    @Index()
    @CreateDateColumn({ name: 'CreatedAt', type: 'datetime2' }) 
    CreatedAt: Date;

    @UpdateDateColumn({ name: 'UpdatedAt', type: 'datetime2', nullable: true }) 
    UpdatedAt: Date;
  }
