import { BadRequestException, Injectable } from '@nestjs/common';
import { OrganizationErrors } from 'src/common/constants/basic.errors';
import { DefaultRoleRepository } from 'src/common/repositories/default-role.repository';
import { OrganizationRepository } from 'src/common/repositories/organization.repository';
import { RoleRepository } from 'src/common/repositories/role.repository';
import { UserOrganizationRoleRepository } from 'src/common/repositories/user-organization-role.repository';
import { UserOrganizationRepository } from 'src/common/repositories/user-organization.repository';
import { UserRepository } from 'src/common/repositories/user.repository';
import { Role } from 'src/common/types/basic.enum';
import { OrganizationEntity } from 'src/core/database/entities/organization.entity';
import { UserOrganizationEntity } from 'src/core/database/entities/user-organization.entity';
import { UserEntity } from 'src/core/database/entities/user.entity';
import {
  CreateOrganizationDto,
  GetOrganizationDto,
  UpdateOrganizationDto,
} from './dtos/organization.dto';
import { SuperAdmin } from 'src/common/constants/super-admin.constant';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
    private readonly defaultRoleRepository: DefaultRoleRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly userOrganizationRepository: UserOrganizationRepository,
    private readonly userOrganizationRoleRepository: UserOrganizationRoleRepository
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
    currentUser: UserEntity
  ): Promise<OrganizationEntity> {
    const { Name } = createOrganizationDto;

    // Check if organization already exists
    const alreadyExists = await this.organizationRepository.getORMMethods().findOne({
      where: { Name, CreatedBy: { Id: currentUser?.Id } },
    });

    if (alreadyExists)
      throw new BadRequestException(OrganizationErrors.ORGANIZATION_ALREADY_EXISTS);

    // Find or create the SUPER_ADMIN role
    let defaultRole = await this.defaultRoleRepository
      .getORMMethods()
      .findOne({ where: { Role: Role.SUPER_ADMIN } });

    if (!defaultRole) {
      defaultRole = await this.defaultRoleRepository.getORMMethods().save({
        Role: Role.SUPER_ADMIN,
        CreatedBy: { Id: currentUser?.Id },
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
        CreatedBy: { Id: currentUser?.Id },
      });
    }

    // Create organization
    return await this.organizationRepository.getORMMethods().save({
      ...createOrganizationDto,
      CreatedBy: currentUser as UserEntity,
    });
  }

  async findAll(
    query: GetOrganizationDto
  ): Promise<{ organizations: OrganizationEntity[]; total: number }> {
    const { page = 1, limit = 10, search, sortBy = 'CreatedAt', order = 'DESC' } = query;

    const qb = this.organizationRepository
      .getORMMethods()
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.UserOrganization', 'userOrganization')
      .where('organization.Name != :organizationName', {
        organizationName: SuperAdmin.organizationName,
      });

    if (search) {
      qb.andWhere('organization.Name LIKE :search', { search: `%${search}%` });
    }

    const [organizations, total] = await qb
      .orderBy(`organization.${sortBy}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { organizations, total };
  }

  async findOne(Id: string): Promise<OrganizationEntity> {
    return await this.organizationRepository.findOneRecord({ Id }, { relations: true });
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto
  ): Promise<OrganizationEntity> {
    const organization = await this.findOne(id);
    if (!organization) throw new BadRequestException(OrganizationErrors.ORGANIZATION_NOT_FOUND);

    Object.assign(organization, updateOrganizationDto);

    // if (UserId) {
    //   const { users } = await this.getUsersByOrganization(id);
    //   const user = await this.userRepository.findOneRecord({ Id: UserId });
    //   if (!user) throw new BadRequestException(AuthError.UserNotFound);

    //   let role = RoleId
    //     ? await this.roleRepository.findOneRecord({ Id: RoleId })
    //     : users?.length
    //       ? await this.roleRepository.findOneRecord({ Name: Role.USER })
    //       : await this.defaultRoleRepository.findOneRecord({ Role: Role.SUPER_ADMIN });

    //   if (!role) {
    //     role = await this.roleRepository.getORMMethods().save({
    //       Name: Role.USER,
    //       CreatedByBy: currentUser,
    //     });
    //   }

    //   let userOrganization = await this.userOrganizationRepository.getORMMethods().findOne({
    //     where: { User: { Id: UserId }, Organization: { Id: id } },
    //   });

    //   if (!userOrganization) {
    //     userOrganization = await this.userOrganizationRepository.getORMMethods().save({
    //       User: { Id: UserId },
    //       Organization: organization,
    //       CreatedByBy: currentUser,
    //     });
    //   }

    //   const userOrganizationRoleExists = await this.userOrganizationRoleRepository
    //     .getORMMethods()
    //     .findOne({
    //       where: { UserOrganization: { Id: userOrganization.Id }, Role: { Id: role.Id } },
    //     });

    //   if (!userOrganizationRoleExists) {
    //     await this.userOrganizationRoleRepository.getORMMethods().save({
    //       UserOrganization: userOrganization,
    //       Role: role,
    //       CreatedBy: currentUser,
    //     });
    //   }
    // }

    return this.organizationRepository.getORMMethods().save(organization);
  }

  async remove(id: string): Promise<void> {
    const organization = await this.findOne(id);
    if (!organization) throw new BadRequestException(OrganizationErrors.ORGANIZATION_NOT_FOUND);

    await this.organizationRepository.getORMMethods().softDelete(organization.Id);
  }

  async getUsersByOrganization(
    organizationId: string,
    query?: GetOrganizationDto
  ): Promise<{ users: UserOrganizationEntity[]; total: number }> {
    const { page, limit, search, sortBy = 'CreatedAt', order = 'DESC' } = query;

    const queryBuilder = this.userOrganizationRepository
      .getORMMethods()
      .createQueryBuilder('userOrganization')
      .leftJoinAndSelect('userOrganization.User', 'user')
      .leftJoinAndSelect('userOrganization.Organization', 'organization')
      .leftJoinAndSelect('userOrganization.UserOrganizationRole', 'userOrganizationRole')
      .leftJoinAndSelect('userOrganizationRole.Role', 'role')
      .where('userOrganization.OrganizationId = :organizationId', { organizationId });

    // Apply search filter (case-insensitive search)
    if (search) {
      queryBuilder.andWhere(
        `(LOWER(user.Name) LIKE LOWER(:search) OR LOWER(user.Email) LIKE LOWER(:search)) OR LOWER(user.FullName) LIKE LOWER(:search))`,
        { search: `%${search}%` }
      );
    }

    queryBuilder.orderBy(`user.${sortBy}`, order as 'ASC' | 'DESC');

    // Pagination logic
    const offset = (page - 1) * limit;

    const [users, total] = await queryBuilder
      .skip(offset) // Apply pagination
      .take(limit) // Fetch limited results
      .getManyAndCount();

    return { users, total };
  }
}
