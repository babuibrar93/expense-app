import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationError } from 'src/common/constants/basic.errors';
import { OrganizationRepository } from 'src/common/repositories/organization.repository';
import { OrganizationEntity } from 'src/core/database/entities/organization.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';

@Injectable()
export class OrganizationService {
  constructor(private readonly organizationRepository: OrganizationRepository) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    const { Name } = createOrganizationDto;
    const alreadExists = await this.organizationRepository.findOne({ Name });
    if (alreadExists) throw new BadRequestException(OrganizationError.alreadyExists);

    return await this.organizationRepository.saveEntity({
      Name,
    } as unknown as OrganizationEntity);
  }

  async findAll(): Promise<OrganizationEntity[]> {
    return await this.organizationRepository.findAll();
  }

  async findOne(id: string): Promise<OrganizationEntity> {
    const organization = await this.organizationRepository.findOne({ Id: id });
    if (!organization) throw new NotFoundException(OrganizationError.notFound);
    return organization;
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto
  ): Promise<OrganizationEntity> {
    const organization = await this.findOne(id);
    Object.assign(organization, updateOrganizationDto);
    return await this.organizationRepository.saveEntity(organization);
  }

  async remove(id: string): Promise<void> {
    const organization = await this.findOne(id);
    await this.organizationRepository.removeEntity(organization);
  }
}
