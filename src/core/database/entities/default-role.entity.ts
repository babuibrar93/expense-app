import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from 'src/common/types/basic.enum';

@Entity({ name: 'DefaultRole' })
export class DefaultRoleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, enum: Role, default: Role.SUPER_ADMIN })
  Role: Role;
}
