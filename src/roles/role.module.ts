import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepository } from 'src/common/repositories/role.repository';

@Module({
  imports: [],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [],
})
export class RoleModule {}
