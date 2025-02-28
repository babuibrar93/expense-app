import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { ApiResponse } from 'src/common/dtos/api-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/common/types/basic.enum';
import { FindUserDto, GetUsersDto, UpdateUserDto } from './dtos/users.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get the list of all users' })
  async findAllUsers(@Query() query: GetUsersDto) {
    const response = await this.userService.findAllUsers(query);
    return new ApiResponse(true, HttpStatus.OK, 'All users fetched successfully.', response);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get user by id' })
  async findOneUserById(@Param() { id }: FindUserDto) {
    const response = await this.userService.findOneUserById(id);
    return new ApiResponse(true, HttpStatus.OK, 'User fetched successfully.', response);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user by id' })
  async updateUserById(@Param() { id }: FindUserDto, @Body() body: UpdateUserDto) {
    const response = await this.userService.updateUserById(id, body);
    return new ApiResponse(true, HttpStatus.OK, 'User updated successfully.', response);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'remove user by id' })
  async removeUserById(@Param() { id }: FindUserDto) {
    const response = await this.userService.removeUser(id);
    return new ApiResponse(true, HttpStatus.OK, 'User deleted successfully.', response);
  }
}
