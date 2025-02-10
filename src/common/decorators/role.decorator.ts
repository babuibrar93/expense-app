import { SetMetadata } from '@nestjs/common';
import { Role } from '../types/basic.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
