import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GeneralError } from '../constants/basic.errors';
import { ApiResponse } from '../dto/api-response.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
// CanActivate → This is an interface that allows us to define custom logic for route protection
export class RoleGuard implements CanActivate {
  // Reflector → A NestJS helper used to retrieve metadata attached to route handlers (e.g., role).
  constructor(
    private reflector: Reflector,
    private readonly userRepository: UserRepository
  ) {}

  // ExecutionContext → Provides details about the current request, including the request object, handler (method), and class (controller)
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    let { user } = request;

    // if (user.Email === 'user@example.com') return true;

    user = await this.userRepository.findOneRecord({ Id: user.Id }, { relations: true });
    // console.log('current user', JSON.stringify(user, null, 2));

    if (!user) {
      throw new HttpException(
        new ApiResponse(false, HttpStatus.UNAUTHORIZED, GeneralError.ForbiddenRole, {
          yourRole: user.Role,
        }),
        HttpStatus.UNAUTHORIZED
      );
    }

    const hasRole = user.UserOrganization.some((org) =>
      org.UserOrganizationRole.some((role) => requiredRoles.includes(role.Role.Name))
    );

    if (!hasRole)
      throw new HttpException(
        new ApiResponse(false, HttpStatus.FORBIDDEN, GeneralError.ForbiddenRole, {
          yourRole: user.Role,
        }),
        HttpStatus.FORBIDDEN
      );

    return true;
  }
}
