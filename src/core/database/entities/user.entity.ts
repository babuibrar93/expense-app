import { Exclude } from 'class-transformer';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserOrganizationEntity } from './user-organization.entity';

@Entity({ name: 'User' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  FullName: string;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  Email: string;

  @Exclude() // Exclude password from API responses
  @Column({ type: 'varchar', length: 255, nullable: true })
  Password: string;

  @OneToMany(() => UserOrganizationEntity, (uo) => uo.User)
  UserOrganization: UserOrganizationEntity[];
}
