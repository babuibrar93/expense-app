import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiResponse } from '../dto/api-response.dto';
import { GeneralError } from '../constants/basic.errors';
import { Role } from '../types/basic.enum';

@Injectable()
// CanActivate → This is an interface that allows us to define custom logic for route protection
export class RoleGuard implements CanActivate {
  // Reflector → A NestJS helper used to retrieve metadata attached to route handlers (e.g., role).
  constructor(private reflector: Reflector) {}

  // ExecutionContext → Provides details about the current request, including the request object, handler (method), and class (controller)
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user || !user.roles) {
      throw new HttpException(
        new ApiResponse(false, HttpStatus.UNAUTHORIZED, GeneralError.ForbiddenRole, {
          yourRole: user.Role,
        }),
        HttpStatus.UNAUTHORIZED
      );
    }

    if (user.Role === Role.SUPER_ADMIN) return true;

    const hasRole = requiredRoles.some((role) => user.Role.includes(role));

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
