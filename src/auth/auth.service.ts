import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { Request } from 'express';
import { AUTH_TOKEN } from 'src/common/constants/basic.constant';
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
import { UserEntity } from 'src/core/database/entities/user.entity';
import { AddUserDto, LoginDto, RegisterDto, UpdateUserDto } from './dtos/auth.dto';
import { ILoginResponse, IOAuthUser } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private auth0Domain: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly roleRepository: RoleRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly userOrganizationRepository: UserOrganizationRepository,
    private readonly userOrganizationRoleRepository: UserOrganizationRoleRepository
  ) {}

  async register(data: RegisterDto): Promise<UserEntity> {
    const { Email, Password } = data;

    // Check if user exists
    const existingUser = await this.userRepository.findOneRecord({ Email });
    if (existingUser) throw new ConflictException(AuthErrors.USER_ALREADY_EXISTS);

    // Hash password and save user
    const hashedPassword = await this.bcryptService.hashPassword(Password);
    const newUser = await this.userRepository
      .getORMMethods()
      .save({ ...data, Password: hashedPassword });

    return newUser;
  }

  async login(data: LoginDto): Promise<ILoginResponse> {
    const { Email, Password } = data;

    // Check if user exists
    const user = await this.userRepository.findOneRecord({ Email }, { relations: true });
    if (!user) throw new NotFoundException(AuthErrors.USER_NOT_FOUND);

    // Verify password
    const matched = await this.bcryptService.comparePassword(Password, user.Password);
    if (!matched) throw new BadRequestException(AuthErrors.INVALID_CREDENTIALS);

    // Generate token
    const token = this.generateAccessToken(user);

    return { user, token };
  }

  async validateSocialLogin(socialUser: IOAuthUser): Promise<ILoginResponse> {
    const { emails, id, displayName } = socialUser;
    if (!id || !emails) throw new BadRequestException(AuthErrors.INVALID_OAUTH_DATA);

    let user = await this.userRepository.findOneRecord({ Email: String(emails) });

    if (!user) {
      user = await this.userRepository.getORMMethods().save({
        Email: emails,
        FullName: displayName || '',
      } as UserEntity);
    }

    const token = this.generateAccessToken(user);

    return { user, token };
  }

  /**
   * Validates and handles social login, checks if user exists, and saves the new user if necessary.
   *
   * @param accessToken The accessToken obtained from the auth0 provider.
   * @returns {ILoginResponse} Returns the user data along with the generated access token.
   */
  async validateOAuthLogin(accessToken: string): Promise<ILoginResponse> {
    // Fetch user data from Auth0
    const auth0Response = await axios.get(`https://${this.auth0Domain}/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { email, name } = auth0Response.data;

    let user = await this.userRepository.findOneRecord({ Email: String(email) });

    if (!user) {
      user = await this.userRepository.getORMMethods().save({
        Email: email,
        FullName: name || '',
      } as unknown as UserEntity);
    }

    const token = await this.generateAccessToken(user);

    return { user, token };
  }

  generateAccessToken(user: UserEntity): string {
    const payload = { Id: user.Id, Email: user.Email };
    return this.jwtService.sign(payload, { expiresIn: '24h' });
  }

  async getTokenFromCookie(req: Request) {
    const token = req.cookies[AUTH_TOKEN]; // Read token from cookie
    return { token };
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
    const user = await this.register({ FullName, Email, Password });

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
