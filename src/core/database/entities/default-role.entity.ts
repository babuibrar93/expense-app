import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ROLE } from 'src/common/types/roles.enum';

@Entity({ name: 'DefaultRole' })
export class DefaultRoleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, enum: ROLE, default: ROLE.SUPER_ADMIN })
  Role: ROLE;
}
