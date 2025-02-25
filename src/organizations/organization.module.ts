import { Module } from '@nestjs/common';
import { DefaultRoleRepository } from 'src/common/repositories/default-role.repository';
import { OrganizationRepository } from 'src/common/repositories/organization.repository';
import { RoleRepository } from 'src/common/repositories/role.repository';
import { UserOrganizationRoleRepository } from 'src/common/repositories/user-organization-role.repository';
import { UserOrganizationRepository } from 'src/common/repositories/user-organization.repository';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { UserRepository } from 'src/common/repositories/user.repository';

@Module({
  controllers: [OrganizationController],
  providers: [
    UserRepository,
    RoleRepository,
    OrganizationService,
    OrganizationRepository,
    UserOrganizationRepository,
    DefaultRoleRepository,
    UserOrganizationRoleRepository,
  ],
  exports: [],
})
export class OrganizationModule {}
