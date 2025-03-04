import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { ApiResponse } from 'src/common/dtos/api-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { Role } from 'src/common/types/basic.enum';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { AddUserDto, UpdateUserDto } from './dtos/add-user.dto';
import { FindUserDto, GetUsersDto } from './dtos/users.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('super-admin/stats')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Super admin stats' })
  async superAdminStats() {
    const response = await this.userService.superAdminStats();
    return new ApiResponse(
      true,
      HttpStatus.OK,
      'Super admin stats fetched successfully.',
      response
    );
  }

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

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'remove user by id' })
  async removeUserById(@Param() { id }: FindUserDto) {
    const response = await this.userService.removeUser(id);
    return new ApiResponse(true, HttpStatus.OK, 'User deleted successfully.', response);
  }

  @Post('add-user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Add user to organization and assign role' })
  async addUserToOrganizationAndAssignRole(
    @Body() addUserDto: AddUserDto,
    @CurrentUser() user: UserEntity,
    @Req() request: Request
  ) {
    const response = await this.userService.addUserToOrganizationAndAssignRole(
      addUserDto,
      user,
      request
    );
    return new ApiResponse(
      true,
      HttpStatus.CREATED,
      'User successfully added to organization and assigned role.',
      response
    );
  }

  @Patch('update-user/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Update user role in organization' })
  async updateUserRoleInOrganization(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: UserEntity,
    @Req() req: Request
  ) {
    const response = await this.userService.updateUserRoleInOrganization(
      userId,
      updateUserDto,
      user,
      req
    );
    return new ApiResponse(
      true,
      HttpStatus.CREATED,
      'User role is successfully updated.',
      response
    );
  }
}
