import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { RoleEntity } from 'src/core/database/entities/role.entity';
import { CreateRoleDto, updateRoleDto } from './dto/role.dto';
import { RoleService } from './role.service';

@Controller('role')
@ApiTags('Role')
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(@Body() dto: CreateRoleDto): Promise<ApiResponse<RoleEntity>> {
    const response = await this.roleService.create(dto);
    return new ApiResponse(true, HttpStatus.CREATED, 'Role created successfully', response);
  }

  @Get()
  async getAllRoles(): Promise<ApiResponse<RoleEntity[]>> {
    const response = await this.roleService.getAll();
    return new ApiResponse(true, HttpStatus.OK, 'All roles fetched successfully', response);
  }

  @Get(':id')
  async getRoleById(@Param('id') id: string): Promise<ApiResponse<RoleEntity>> {
    const response = await this.roleService.getRoleById(id);
    return new ApiResponse(true, HttpStatus.OK, 'Role fetched successfully', response);
  }

  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() dto: updateRoleDto
  ): Promise<ApiResponse<RoleEntity>> {
    const response = await this.roleService.update(id, dto);
    return new ApiResponse(true, HttpStatus.OK, 'Role updated successfully', response);
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: string): Promise<unknown> {
    await this.roleService.deleteRole(id);
    return new ApiResponse(true, HttpStatus.OK, 'Role deleted successfully');
  }
}
