import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserOrganizationEntity } from 'src/core/database/entities/user-organization.entity';
import { GeneralErrors } from '../constants/basic.errors';
import { SuperAdmin } from '../constants/super-admin.constant';
import { ApiResponse } from '../dtos/api-response.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(private readonly userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let { user, params, body } = request;
    user = await this.userRepository.findOneRecord({ Id: user.Id }, { relations: true });

    if (!user || !user?.UserOrganization?.length)
      throw new HttpException(
        new ApiResponse(
          false,
          HttpStatus.FORBIDDEN,
          GeneralErrors.USER_NOT_ASSOCIATED_WITH_ORGANIZATION
        ),
        HttpStatus.FORBIDDEN
      );

    // Allow access if it is Super Admin
    const isSuperAdmin = user.UserOrganization.some((org: UserOrganizationEntity) =>
      org.UserOrganizationRole.some((role) => role.Role.Name == SuperAdmin.roleName)
    );
    // console.log('current user', JSON.stringify(user, null, 2));

    if (isSuperAdmin) return true;

    // IDs of the organization from which user belongs
    const userOrganizationIds = user?.UserOrganization?.map(
      (org: UserOrganizationEntity) => org?.Organization?.Id
    );

    // User requested organization ID
    const requestOrganizationId = body?.OrganizationId || params?.organizationId;

    if (!userOrganizationIds.includes(requestOrganizationId)) {
      throw new HttpException(
        new ApiResponse(
          false,
          HttpStatus.UNAUTHORIZED,
          GeneralErrors.USER_NOT_AUTHORIZED_FOR_ORGANIZATION
        ),
        HttpStatus.FORBIDDEN
      );
    }

    return true;
  }
}
