import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { OrganizationRepository } from 'src/common/repositories/organization.repository';

@Module({
  imports: [],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationRepository],
  exports: [],
})
export class OrganizationModule {}
