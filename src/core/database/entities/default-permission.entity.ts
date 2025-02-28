import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Permission } from 'src/common/types/basic.enum';

@Entity({ name: 'DefaultPermission' })
export class DefaultPermissionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 250, enum: Permission, default: Permission.READ })
  Name: Permission;
}
