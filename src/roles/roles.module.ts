import { Module } from '@nestjs/common';
import { RoleRepository } from 'src/common/repositories/role.repository';
import { UserRepository } from 'src/common/repositories/user.repository';
import { RoleController } from './roles.controller';
import { RoleService } from './role.service';
import { ModuleRepository } from 'src/common/repositories/module.repository';
import { RoleModuleRepository } from 'src/common/repositories/role-module.repository';
import { RoleModulePermissionRepository } from 'src/common/repositories/role-module-permission.entity';
import { DefaultPermissionRepository } from 'src/common/repositories/default-permission.repository';

@Module({
  imports: [],
  controllers: [RoleController],
  providers: [
    RoleService,
    RoleRepository,
    UserRepository,
    ModuleRepository,
    RoleModuleRepository,
    DefaultPermissionRepository,
    RoleModulePermissionRepository,
  ],
  exports: [],
})
export class RoleModule {}
