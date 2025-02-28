import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
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
import { OrganizationEntity } from 'src/core/database/entities/organization.entity';
import { UserEntity } from 'src/core/database/entities/user.entity';
import {
  CreateOrganizationDto,
  GetOrganizationDto,
  UpdateOrganizationDto,
} from './dtos/organization.dto';
import { OrganizationService } from './organization.service';

@Controller('organization')
@ApiTags('Organization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  @Roles(Role.SUPER_ADMIN)
  @UseInterceptors(TransactionInterceptor)
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @CurrentUser() currentUser: UserEntity
  ): Promise<ApiResponse<OrganizationEntity>> {
    const response = await this.organizationService.create(createOrganizationDto, currentUser);
    return new ApiResponse(true, HttpStatus.CREATED, 'Organization created successfully', response);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing organization and assign role to user' })
  @Roles(Role.SUPER_ADMIN)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ): Promise<ApiResponse<OrganizationEntity>> {
    const response = await this.organizationService.update(id, updateOrganizationDto);
    return new ApiResponse(true, HttpStatus.OK, 'Organization updated successfully', response);
  }

  @Get('/:organizationId/users')
  @ApiOperation({ summary: 'Get users of an organization' })
  @Roles(Role.SUPER_ADMIN)
  async getUsersByOrganization(
    @Param('organizationId') id: string,
    @Query() query: GetOrganizationDto
  ) {
    const response = await this.organizationService.getUsersByOrganization(id, query);
    return new ApiResponse(
      true,
      HttpStatus.OK,
      'Users by organization retrieved successfully',
      response
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  @Roles(Role.SUPER_ADMIN)
  async findAll(
    @Query() query: GetOrganizationDto
  ): Promise<ApiResponse<{ organizations: OrganizationEntity[]; total: number }>> {
    const response = await this.organizationService.findAll(query);
    return new ApiResponse(true, HttpStatus.OK, 'Organizations retrieved successfully', response);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organization by ID' })
  @Roles(Role.SUPER_ADMIN)
  async findOne(@Param('id') id: string): Promise<ApiResponse<OrganizationEntity>> {
    const response = await this.organizationService.findOne(id);
    return new ApiResponse(true, HttpStatus.OK, 'Organization retrieved successfully', response);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organization by ID' })
  @Roles(Role.SUPER_ADMIN)
  async remove(@Param('id') id: string): Promise<unknown> {
    await this.organizationService.remove(id);
    return new ApiResponse(true, HttpStatus.OK, 'Organization deleted successfully');
  }
}
