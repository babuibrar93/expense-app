import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { OrganizationEntity } from 'src/core/database/entities/organization.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { OrganizationService } from './organization.service';

@Controller('organizations')
@ApiTags('Organizations')
@ApiBearerAuth()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto
  ): Promise<ApiResponse<OrganizationEntity>> {
    const response = await this.organizationService.create(createOrganizationDto);
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
