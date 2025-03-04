import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { ApiResponse } from 'src/common/dtos/api-response.dto';
import { Role } from 'src/common/types/basic.enum';
import { ModuleEntity } from 'src/core/database/entities/module.entity';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { CreateModuleDto, UpdateModuleDto } from 'src/modules/dtos/module.dto';
import { ModuleService } from 'src/modules/module.service';

@Controller('module')
@ApiTags('Module')
@ApiBearerAuth()
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  @ApiOperation({ summary: 'Create a new module' })
  async createModule(
    @Body() createModuleDto: CreateModuleDto,
    @CurrentUser() currentUser: UserEntity
  ): Promise<ApiResponse<ModuleEntity>> {
    const response = await this.moduleService.createModule(createModuleDto, currentUser);
    return new ApiResponse(true, HttpStatus.CREATED, 'Module created successfully', response);
  }

  @Get()
  @ApiOperation({ summary: 'Get all modules' })
  async getAllModules(): Promise<ApiResponse<ModuleEntity[]>> {
    const response = await this.moduleService.getAllModules();
    return new ApiResponse(true, HttpStatus.OK, 'Modules fetched successfully', response);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a module by ID' })
  async getModuleById(@Param('id') moduleId: string): Promise<ApiResponse<ModuleEntity>> {
    const response = await this.moduleService.getModuleById(moduleId);
    return new ApiResponse(true, HttpStatus.OK, 'Module fetched successfully', response);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  @ApiOperation({ summary: 'Update a module by ID' })
  async updateModule(
    @Param('id') moduleId: string,
    @Body() updateModuleDto: UpdateModuleDto
  ): Promise<ApiResponse<ModuleEntity>> {
    const response = await this.moduleService.updateModule(moduleId, updateModuleDto);
    return new ApiResponse(true, HttpStatus.OK, 'Module updated successfully', response);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  @ApiOperation({ summary: 'Delete a module by ID' })
  async deleteModule(@Param('id') moduleId: string): Promise<ApiResponse<null>> {
    await this.moduleService.deleteModule(moduleId);
    return new ApiResponse(true, HttpStatus.OK, 'Module deleted successfully', null);
  }
}
