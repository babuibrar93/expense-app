import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import {
  AuthErrors,
  GeneralErrors,
  OrganizationErrors,
  RoleErrors,
} from 'src/common/constants/basic.errors';
import { OrganizationRepository } from 'src/common/repositories/organization.repository';
import { RoleRepository } from 'src/common/repositories/role.repository';
import { UserOrganizationRoleRepository } from 'src/common/repositories/user-organization-role.repository';
import { UserOrganizationRepository } from 'src/common/repositories/user-organization.repository';
import { UserRepository } from 'src/common/repositories/user.repository';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { Role } from 'src/common/types/basic.enum';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { AddUserDto, UpdateUserDto } from './dtos/add-user.dto';
import { GetUsersDto } from './dtos/users.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly bcryptService: BcryptService,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly userOrganizationRepository: UserOrganizationRepository,
    private readonly userOrganizationRoleRepository: UserOrganizationRoleRepository
  ) {}

  async findAllUsers(query: GetUsersDto) {
    const { page, limit, search, sortBy = 'CreatedAt', order = 'DESC' } = query;

    const queryBuilder = this.userRepository
      .getORMMethods()
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.UserOrganization', 'userOrganization')
      .leftJoinAndSelect('userOrganization.Organization', 'organization')
      .leftJoinAndSelect('userOrganization.UserOrganizationRole', 'userOrganizationRole')
      .leftJoinAndSelect('userOrganizationRole.Role', 'role');

    if (search) {
      queryBuilder.andWhere(
        '(user.Name ILIKE :search OR user.Email ILIKE :search OR user.FullName ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply sorting dynamically
    queryBuilder.orderBy(`user.${sortBy}`, order as 'ASC' | 'DESC');

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { users, total };
  }

  async findOneUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneRecord({ Id: id }, { relations: true });
    if (!user) throw new NotFoundException(AuthErrors.USER_NOT_FOUND);
    return user;
  }

  async removeUser(id: string): Promise<boolean> {
    const user = await this.userRepository.findOneRecord({ Id: id });
    if (!user) throw new NotFoundException(AuthErrors.USER_NOT_FOUND);

    await this.userRepository.getORMMethods().softDelete(user.Id);
    return true;
  }

  async superAdminStats() {
    const [totalUsers, totalOrganizations, totalGlobalRoles, totalOrgAdmins] = await Promise.all([
      this.userRepository.getORMMethods().count(),
      this.organizationRepository.getORMMethods().count(),
      this.roleRepository.getORMMethods().count(),
      this.roleRepository.getORMMethods().count({
        where: { Name: Role.ORG_ADMIN },
      }),
    ]);

    return {
      totalUsers,
      totalOrganizations,
      totalGlobalRoles,
      totalOrgAdmins,
    };
  }

  async addUserToOrganizationAndAssignRole(
    addUserDto: AddUserDto,
    currentUser: UserEntity,
    request: Request
  ) {
    const { RoleId, OrganizationId, FullName, Email, Password } = addUserDto;

    // Use repositories with transaction support
    const userOrgRepo = this.userOrganizationRepository.getORMMethods(request);
    const userOrgRoleRepo = this.userOrganizationRoleRepository.getORMMethods(request);

    // Ensure user does not already exist
    const existingUser = await this.userRepository.findOneRecord({ Email });
    if (existingUser) throw new ConflictException(AuthErrors.USER_ALREADY_EXISTS);

    // Fetch role and organization
    const role = await this.roleRepository.findOneRecord({ Id: RoleId });
    if (!role) throw new NotFoundException(RoleErrors.ROLE_NOT_FOUND);

    const organization = await this.organizationRepository.findOneRecord({ Id: OrganizationId });
    if (!organization) throw new NotFoundException(OrganizationErrors.ORGANIZATION_NOT_FOUND);

    // Register the user
    const user = await this.authService.register({ FullName, Email, Password });

    // Check if user is already assigned to the organization
    let userOrganization = await userOrgRepo.findOne({
      where: { User: { Id: user.Id }, Organization: { Id: OrganizationId } },
    });

    if (!userOrganization) {
      userOrganization = await userOrgRepo.save({
        User: { Id: user.Id },
        Organization: { Id: OrganizationId },
        CreatedBy: currentUser,
      });
    }

    // Ensure the user does not already have the role
    const userOrganizationRoleExists = await userOrgRoleRepo.findOne({
      where: { UserOrganization: { Id: userOrganization.Id }, Role: { Id: role.Id } },
    });

    if (userOrganizationRoleExists)
      throw new BadRequestException(OrganizationErrors.USER_ALREADY_HAS_ROLE_IN_ORGANIZATION);

    // Assign the role to the user in the organization
    return await userOrgRoleRepo.save({
      UserOrganization: userOrganization,
      Role: role,
      CreatedBy: currentUser,
    });
  }

  async updateUserRoleInOrganization(
    userId: string,
    updateUserDto: UpdateUserDto,
    currentUser: UserEntity,
    request: Request
  ) {
    const { RoleId, OrganizationId, FullName, Email, Password } = updateUserDto;

    if (!RoleId && !OrganizationId)
      throw new BadRequestException(GeneralErrors.ROLE_ORGANIZATION_REQUIRED);

    const userRepo = this.userRepository.getORMMethods(request);
    const roleRepo = this.roleRepository.getORMMethods(request);
    const orgRepo = this.organizationRepository.getORMMethods(request);
    const userOrgRepo = this.userOrganizationRepository.getORMMethods(request);
    const userOrgRoleRepo = this.userOrganizationRoleRepository.getORMMethods(request);

    // Fetch user, role, and organization in parallel
    const [existingUser, role, organization] = await Promise.all([
      userRepo.findOne({ where: { Id: userId } }),
      roleRepo.findOne({ where: { Id: RoleId } }),
      orgRepo.findOne({ where: { Id: OrganizationId } }),
    ]);

    if (!existingUser) throw new NotFoundException(AuthErrors.USER_NOT_FOUND);
    if (!role) throw new NotFoundException(RoleErrors.ROLE_NOT_FOUND);
    if (!organization) throw new NotFoundException(OrganizationErrors.ORGANIZATION_NOT_FOUND);

    if (Email) existingUser.Email = Email;
    if (FullName) existingUser.FullName = FullName;
    if (Password) existingUser.Password = await this.bcryptService.hashPassword(Password);

    await userRepo.save(existingUser);

    // Check if user is already assigned to the organization
    let userOrganization = await userOrgRepo.findOne({
      where: { User: { Id: existingUser.Id }, Organization: { Id: OrganizationId } },
    });

    if (!userOrganization) throw new NotFoundException(OrganizationErrors.USER_NOT_IN_ORGANIZATION);

    // Ensure the user does not already have the role
    const userOrganizationRoleExists = await userOrgRoleRepo.findOne({
      where: { UserOrganization: { Id: userOrganization.Id }, Role: { Id: role.Id } },
    });

    if (userOrganizationRoleExists)
      throw new BadRequestException(OrganizationErrors.USER_ALREADY_HAS_ROLE_IN_ORGANIZATION);

    // Assign the role to the user in the organization
    return await userOrgRoleRepo.save({
      UserOrganization: userOrganization,
      Role: role,
      CreatedBy: currentUser,
    });
  }
}
