import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserService } from './user.service';
import { Role } from 'src/common/types/basic.enum';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.SUPER_ADMIN)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Get the list of all users' })
  async findAllUsers() {
    const response = await this.userService.findAllUsers();
    return new ApiResponse(true, HttpStatus.OK, 'All users fetched successfully.', response);
  }
}
