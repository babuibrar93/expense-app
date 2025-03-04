import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { OrganizationRepository } from 'src/common/repositories/organization.repository';
import { RoleRepository } from 'src/common/repositories/role.repository';
import { UserOrganizationRoleRepository } from 'src/common/repositories/user-organization-role.repository';
import { UserOrganizationRepository } from 'src/common/repositories/user-organization.repository';
import { UserRepository } from 'src/common/repositories/user.repository';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { UserService } from './user.service';
import { UserController } from './users.controller';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    RoleRepository,
    BcryptService,
    AuthService,
    OrganizationRepository,
    UserOrganizationRepository,
    UserOrganizationRoleRepository,
  ],
  exports: [UserRepository],
})
export class UserModule {}
