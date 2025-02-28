import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiResponse } from 'src/common/dtos/api-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { RoleEntity } from 'src/core/database/entities/role.entity';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { AssignModulesToRoleDto, CreateRoleDto, updateRoleDto } from './dtos/roles.dto';
import { RoleService } from './role.service';
import { Request } from 'express';

@Controller('role')
@ApiTags('Role')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  async createRole(
    @Body() dto: CreateRoleDto,
    @CurrentUser() currentUser: UserEntity
  ): Promise<ApiResponse<RoleEntity>> {
    const response = await this.roleService.create(dto, currentUser);
    return new ApiResponse(true, HttpStatus.CREATED, 'Role created successfully', response);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  async getAllRoles(): Promise<ApiResponse<RoleEntity[]>> {
    const response = await this.roleService.getAll();
    return new ApiResponse(true, HttpStatus.OK, 'All roles fetched successfully', response);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  async getRoleById(@Param('id') id: string): Promise<ApiResponse<RoleEntity>> {
    const response = await this.roleService.getRoleById(id);
    return new ApiResponse(true, HttpStatus.OK, 'Role fetched successfully', response);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a role by ID' })
  async updateRole(
    @Param('id') id: string,
    @Body() dto: updateRoleDto
  ): Promise<ApiResponse<RoleEntity>> {
    const response = await this.roleService.update(id, dto);
    return new ApiResponse(true, HttpStatus.OK, 'Role updated successfully', response);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role by ID' })
  async deleteRole(@Param('id') id: string): Promise<ApiResponse<null>> {
    await this.roleService.deleteRole(id);
    return new ApiResponse(true, HttpStatus.OK, 'Role deleted successfully', null);
  }

  @Post('assign-role-to-module')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Assign a role to modules with permissions' })
  async assignModulesToRole(
    @Body() assignModulesToRoleDto: AssignModulesToRoleDto,
    @CurrentUser() currentUser: UserEntity,
    @Req() request: Request
  ) {
    const response = await this.roleService.assignModulesToRole(
      assignModulesToRoleDto,
      currentUser,
      request
    );
    return new ApiResponse(true, HttpStatus.OK, 'Role assigned successfully', response);
  }
}
