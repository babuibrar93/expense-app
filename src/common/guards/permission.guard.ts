import { CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../dto/api-response.dto';
import { GeneralError } from '../constants/basic.errors';

export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.get('permissions', context.getHandler());
    if (!requiredPermissions) return false;

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const hasPermissions = requiredPermissions?.some((permission) =>
      user.permission.includes(permission)
    );

    if (!hasPermissions) {
      throw new HttpException(
        new ApiResponse(false, HttpStatus.FORBIDDEN, GeneralError.forbiddenPermission),
        HttpStatus.FORBIDDEN
      );
    }
    return true;
  }
}
