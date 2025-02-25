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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { OrganizationEntity } from 'src/core/database/entities/organization.entity';
import { UserEntity } from 'src/core/database/entities/user.entity';
import {
  CreateOrganizationDto,
  GetOrganizationDto,
  UpdateOrganizationDto,
} from './dto/organization.dto';
import { OrganizationService } from './organization.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/types/basic.enum';

@Controller('organization')
@ApiTags('Organization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
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
  @Roles(Role.SUPER_ADMIN)
  @UseInterceptors(TransactionInterceptor)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ): Promise<ApiResponse<OrganizationEntity>> {
    const response = await this.organizationService.update(id, user, updateOrganizationDto);
    return new ApiResponse(true, HttpStatus.OK, 'Organization updated successfully', response);
  }

  @Get('/:organizationId/users')
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
  @Roles(Role.SUPER_ADMIN)
  async findAll(
    @Query() query: GetOrganizationDto
  ): Promise<ApiResponse<{ organizations: OrganizationEntity[]; total: number }>> {
    const response = await this.organizationService.findAll(query);
    return new ApiResponse(true, HttpStatus.OK, 'Organizations retrieved successfully', response);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN)
  async findOne(@Param('id') id: string): Promise<ApiResponse<OrganizationEntity>> {
    const response = await this.organizationService.findOne(id);
    return new ApiResponse(true, HttpStatus.OK, 'Organization retrieved successfully', response);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  async remove(@Param('id') id: string): Promise<unknown> {
    await this.organizationService.remove(id);
    return new ApiResponse(true, HttpStatus.OK, 'Organization deleted successfully');
  }
}
