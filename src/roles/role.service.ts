import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { ModuleErrors, RoleErrors } from 'src/common/constants/basic.errors';
import { DefaultPermissionRepository } from 'src/common/repositories/default-permission.repository';
import { ModuleRepository } from 'src/common/repositories/module.repository';
import { RoleModulePermissionRepository } from 'src/common/repositories/role-module-permission.entity';
import { RoleModuleRepository } from 'src/common/repositories/role-module.repository';
import { RoleRepository } from 'src/common/repositories/role.repository';
import { RoleEntity } from 'src/core/database/entities/role.entity';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { In } from 'typeorm';
import { AssignModulesToRoleDto, CreateRoleDto, updateRoleDto } from './dtos/roles.dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly moduleRepository: ModuleRepository,
    private readonly roleModuleRepository: RoleModuleRepository,
    private readonly roleModulePermissionRepository: RoleModulePermissionRepository,
    private readonly defaultPermissionRepository: DefaultPermissionRepository
  ) {}

  async create(createRoleDto: CreateRoleDto, currentUser: UserEntity): Promise<RoleEntity> {
    const { Name } = createRoleDto;

    const alreadyExists = await this.roleRepository.findOneRecord({ Name });
    if (alreadyExists) throw new BadRequestException(RoleErrors.ROLE_ALREADY_EXISTS);

    return this.roleRepository.getORMMethods().save({ Name, CreatedBy: currentUser });
  }

  async getAll(): Promise<RoleEntity[]> {
    return this.roleRepository.getORMMethods().find();
  }

  async getRoleById(Id: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOneRecord({ Id });
    if (!role) throw new NotFoundException(RoleErrors.ROLE_NOT_FOUND);
    return role;
  }

  async update(id: string, dto: updateRoleDto): Promise<RoleEntity> {
    const role = await this.getRoleById(id);
    Object.assign(role, dto);
    return this.roleRepository.getORMMethods().save(role);
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.getRoleById(id);
    await this.roleRepository.getORMMethods().delete(role.Id);
  }

  async assignModulesToRole(
    assignModulesToRoleDto: AssignModulesToRoleDto,
    currentUser: UserEntity,
    request: Request
  ) {
    const { RoleId, ModulePermissions } = assignModulesToRoleDto;

    const roleModuleRepo = this.roleModuleRepository.getORMMethods(request);
    const roleModulePermissionRepo = this.roleModulePermissionRepository.getORMMethods(request);

    const defaultPermissions = await this.defaultPermissionRepository.getORMMethods().find();
    const defaultPermissionSet = defaultPermissions.map((p) => p.Name);

    const role = await this.roleRepository.findOneRecord({ Id: RoleId });
    if (!role) throw new NotFoundException(RoleErrors.ROLE_NOT_FOUND);

    return Promise.all(
      ModulePermissions.map(async ({ ModuleId, Permissions }) => {
        const invalidPermissions = Permissions?.filter(
          (p: any) => !defaultPermissionSet.includes(p)
        );

        if (invalidPermissions.length > 0)
          throw new BadRequestException(`Invalid permissions: ${invalidPermissions.join(', ')}`);

        const module = await this.moduleRepository.findOneRecord({ Id: ModuleId });
        if (!module) throw new NotFoundException(ModuleErrors.MODULE_NOT_FOUND);

        // Check if RoleModule already exists
        let roleModule = await this.roleModuleRepository.findOneRecord({
          Role: role,
          Module: module,
        });

        // Create RoleModule if it doesn't exist
        if (!roleModule) {
          roleModule = await roleModuleRepo.save({
            Role: role,
            Module: module,
            CreatedBy: currentUser,
          });
        }

        // Fetch existing RoleModulePermissions
        const existingPermissions = await this.roleModulePermissionRepository.getORMMethods().find({
          where: { RoleModule: roleModule, Permission: In(Permissions) },
        });

        const existingPermissionSet = new Set(existingPermissions.map((p) => p.Permission));

        // Filter out permissions that already exist
        const newPermissions = Permissions.filter(
          (permission) => !existingPermissionSet.has(permission)
        );

        if (newPermissions.length > 0) {
          const roleModulePermissions = newPermissions.map((permission) => ({
            RoleModule: roleModule,
            Permission: permission,
            CreatedBy: currentUser,
          }));

          await roleModulePermissionRepo.save(roleModulePermissions);
        }

        return roleModule;
      })
    );
  }
}
