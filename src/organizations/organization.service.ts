import { BadRequestException, Injectable } from '@nestjs/common';
import { OrganizationError } from 'src/common/constants/basic.errors';
import { DefaultRoleRepository } from 'src/common/repositories/default-role.repository';
import { OrganizationRepository } from 'src/common/repositories/organization.repository';
import { RoleRepository } from 'src/common/repositories/role.repository';
import { UserOrganizationRoleRepository } from 'src/common/repositories/user-organization-role.repository';
import { UserOrganizationRepository } from 'src/common/repositories/user-organization.repository';
import { Role } from 'src/common/types/basic.enum';
import { OrganizationEntity } from 'src/core/database/entities/organization.entity';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly roleRepository: RoleRepository,
    private readonly defaultRoleRepository: DefaultRoleRepository,
    private readonly userOrganizationRepository: UserOrganizationRepository,
    private readonly userOrganizationRoleRepository: UserOrganizationRoleRepository
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
    currentUser: UserEntity
  ): Promise<OrganizationEntity> {
    const { Name, Description } = createOrganizationDto;

    // Check if organization already exists
    const alreadyExists = await this.organizationRepository
      .getORMMethods()
      .findOne({
        where: { Name, CreatedBy: { Id: currentUser?.Id } },
      });

    if (alreadyExists) throw new BadRequestException(OrganizationError.alreadyExists);

    // Find or create the SUPER_ADMIN role
    let defaultRole = await this.defaultRoleRepository
      .getORMMethods()
      .findOne({ where: { Role: Role.SUPER_ADMIN } });

    if (!defaultRole) {
      defaultRole = await this.defaultRoleRepository.getORMMethods().save({
        Role: Role.SUPER_ADMIN,
        CreatedBy: currentUser,
      });
    }

    // Create a new role linked to the SUPER_ADMIN
    let savedRole = await this.roleRepository.getORMMethods().findOne({
      where: {
        Name: defaultRole.Role,
      },
    });

    if (!savedRole) {
      savedRole = await this.roleRepository.getORMMethods().save({
        Name: defaultRole.Role,
        CreatedBy: currentUser,
      });
    }

    // Create organization
    const savedOrganization = await this.organizationRepository.getORMMethods().save({
      Name,
      Description,
      CreatedBy: currentUser,
    });

    // Create User-Organization relation
    const savedUserOrganization = await this.userOrganizationRepository.getORMMethods().save({
      User: currentUser,
      Organization: savedOrganization,
      CreatedBy: currentUser,
    });

    // Assign role to the user within the organization
    await this.userOrganizationRoleRepository.getORMMethods().save({
      UserOrganization: savedUserOrganization,
      Role: savedRole,
      CreatedBy: currentUser,
    });

    return savedOrganization;
  }

  async findAll(): Promise<OrganizationEntity[]> {
    return await this.organizationRepository.getORMMethods().find();
  }

  async findOne(id: string): Promise<OrganizationEntity> {
    return await this.organizationRepository.getORMMethods().findOne({ where: { Id: id } });
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<OrganizationEntity> {
    const organization = await this.findOne(id);
    if (!organization) throw new BadRequestException('Organization not found');

    Object.assign(organization, updateOrganizationDto);
    return await this.organizationRepository.getORMMethods().save(organization);
  }

  async remove(id: string): Promise<void> {
    const organization = await this.findOne(id);
    if (!organization) throw new BadRequestException('Organization not found');

    await this.organizationRepository.getORMMethods().remove(organization);
  }
}
