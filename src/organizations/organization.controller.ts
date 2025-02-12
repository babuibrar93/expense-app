import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { Role } from 'src/common/types/basic.enum';
import { OrganizationEntity } from 'src/core/database/entities/organization.entity';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { OrganizationService } from './organization.service';

@Controller('organization')
@ApiTags('Organization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
// @Roles(Role.SUPER_ADMIN)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @CurrentUser() currentUser: UserEntity
  ): Promise<ApiResponse<OrganizationEntity>> {
    const response = await this.organizationService.create(createOrganizationDto, currentUser);
    return new ApiResponse(true, HttpStatus.CREATED, 'Organization created successfully', response);
  }

  @Get()
  async findAll(): Promise<ApiResponse<OrganizationEntity[]>> {
    const response = await this.organizationService.findAll();
    return new ApiResponse(true, HttpStatus.OK, 'Organizations retrieved successfully', response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<OrganizationEntity>> {
    const response = await this.organizationService.findOne(id);
    return new ApiResponse(true, HttpStatus.OK, 'Organization retrieved successfully', response);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ): Promise<ApiResponse<OrganizationEntity>> {
    const response = await this.organizationService.update(id, updateOrganizationDto);
    return new ApiResponse(true, HttpStatus.OK, 'Organization updated successfully', response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<unknown> {
    await this.organizationService.remove(id);
    return new ApiResponse(true, HttpStatus.OK, 'Organization deleted successfully');
  }
}
