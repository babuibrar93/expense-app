import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ModuleErrors } from 'src/common/constants/basic.errors';
import { ModuleRepository } from 'src/common/repositories/module.repository';
import { ModuleEntity } from 'src/core/database/entities/module.entity';
import { CreateModuleDto, UpdateModuleDto } from './dtos/module.dto';

@Injectable()
export class ModuleService {
  constructor(private readonly moduleRepository: ModuleRepository) {}

  async createModule(createModuleDto: CreateModuleDto): Promise<ModuleEntity> {
    const { Name, ParentId } = createModuleDto;

    const alreadyExists = await this.moduleRepository.findOneRecord({ Name });
    if (alreadyExists) throw new BadRequestException(ModuleErrors.MODULE_ALREADY_EXISTS);

    let parentModule = null;
    if (ParentId) {
      parentModule = await this.moduleRepository.findOneRecord({ Id: ParentId });
      if (!parentModule) throw new NotFoundException(ModuleErrors.PARENT_MODULE_NOT_FOUND);
    }

    const newModule = this.moduleRepository.getORMMethods().create({
      Name,
      ParentModule: parentModule,
    });

    return await this.moduleRepository.getORMMethods().save(newModule);
  }

  async getAllModules(): Promise<ModuleEntity[]> {
    return await this.moduleRepository.getORMMethods().find({
      relations: ['ParentModule', 'SubModules'],
    });
  }

  async getModuleById(moduleId: string): Promise<ModuleEntity> {
    const module = await this.moduleRepository.findOneRecord({ Id: moduleId });
    if (!module) throw new NotFoundException(ModuleErrors.MODULE_NOT_FOUND);
    return module;
  }

  async updateModule(moduleId: string, updateModuleDto: UpdateModuleDto): Promise<ModuleEntity> {
    const module = await this.getModuleById(moduleId);

    Object.assign(module, updateModuleDto);
    return await this.moduleRepository.getORMMethods().save(module);
  }

  async deleteModule(moduleId: string): Promise<void> {
    const module = await this.getModuleById(moduleId);

    await this.moduleRepository.getORMMethods().softDelete(module.Id);
  }
}
