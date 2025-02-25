import { Module } from '@nestjs/common';
import { RoleRepository } from 'src/common/repositories/role.repository';
import { UserOrganizationRoleRepository } from 'src/common/repositories/user-organization-role.repository';
import { UserOrganizationRepository } from 'src/common/repositories/user-organization.repository';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { UserRepository } from 'src/common/repositories/user.repository';

@Module({
  imports: [],
  controllers: [RoleController],
  providers: [
    RoleService,
    RoleRepository,
    UserRepository,
    UserOrganizationRepository,
    UserOrganizationRoleRepository,
  ],
  exports: [],
})
export class RoleModule {}
