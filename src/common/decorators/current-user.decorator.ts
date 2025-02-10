import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/core/database/entities/user.entity';

/**
 * Custom decorator to retrieve the currently authenticated user from the request.
 *
 * - If no parameter is passed, it returns the entire user object.
 * - If a specific field (e.g., `@CurrentUser('id')`) is requested, it returns only that field.
 */
export const CurrentUser = createParamDecorator(
  (data: keyof UserEntity | undefined, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  }
);
