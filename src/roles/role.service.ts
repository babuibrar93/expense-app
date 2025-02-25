import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationError, RoleError } from 'src/common/constants/basic.errors';
import { RoleRepository } from 'src/common/repositories/role.repository';
import { UserOrganizationRoleRepository } from 'src/common/repositories/user-organization-role.repository';
import { UserOrganizationRepository } from 'src/common/repositories/user-organization.repository';
import { RoleEntity } from 'src/core/database/entities/role.entity';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { AssignRoleDto, CreateRoleDto, updateRoleDto } from './dto/role.dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly userOrganizationRepository: UserOrganizationRepository,
    private readonly userOrganizationRoleRepository: UserOrganizationRoleRepository
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const { Name } = createRoleDto;

    const alreadyExists = await this.roleRepository.findOneRecord({ Name });
    if (alreadyExists) throw new BadRequestException(RoleError.alreadyExists);

    return this.roleRepository.getORMMethods().save({ Name });
  }

  async getAll(): Promise<RoleEntity[]> {
    return this.roleRepository.getORMMethods().find();
  }

  async getRoleById(Id: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOneRecord({ Id });
    if (!role) throw new NotFoundException(RoleError.notFound);
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

  async assignRoleToUser(body: AssignRoleDto, currentUser: UserEntity) {
    const { userId, organizationId, roleId } = body;

    const userOrganization = await this.userOrganizationRepository.findOneRecord({
      User: { Id: userId },
      Organization: { Id: organizationId },
    });
    if (!userOrganization) throw new BadRequestException(OrganizationError.userNotFound);

    const existingRole = await this.userOrganizationRoleRepository.findOneRecord({
      UserOrganization: { Id: userOrganization.Id },
      Role: { Id: roleId },
    });
    if (existingRole) throw new BadRequestException(RoleError.userAlreadyHasRole);

    return this.userOrganizationRoleRepository.getORMMethods().save({
      UserOrganization: userOrganization,
      Role: { Id: roleId },
      CreatedBy: currentUser,
    });
  }
}
