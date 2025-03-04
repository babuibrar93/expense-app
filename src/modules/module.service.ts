import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ModuleErrors } from 'src/common/constants/basic.errors';
import { ModuleRepository } from 'src/common/repositories/module.repository';
import { ModuleEntity } from 'src/core/database/entities/module.entity';
import { CreateModuleDto, UpdateModuleDto } from './dtos/module.dto';
import { UserEntity } from 'src/core/database/entities/user.entity';

@Injectable()
export class ModuleService {
  constructor(private readonly moduleRepository: ModuleRepository) {}

  async createModule(
    createModuleDto: CreateModuleDto,
    currentUser: UserEntity
  ): Promise<ModuleEntity> {
    const { Name, ModuleCode, ParentId } = createModuleDto;

    const alreadyExists = await this.moduleRepository.getORMMethods().findOne({
      where: [{ Name }, { ModuleCode }],
    });
    if (alreadyExists) throw new BadRequestException(ModuleErrors.MODULE_ALREADY_EXISTS);

    let parentModule = null;
    if (ParentId) {
      parentModule = await this.moduleRepository.findOneRecord({ Id: ParentId });
      if (!parentModule) throw new NotFoundException(ModuleErrors.PARENT_MODULE_NOT_FOUND);
    }

    const newModule = this.moduleRepository.getORMMethods().create({
      Name,
      ModuleCode,
      ParentModule: parentModule,
      CreatedBy: currentUser,
    });

    return await this.moduleRepository.getORMMethods().save(newModule);
  }

  async getAllModules(): Promise<ModuleEntity[]> {
    const allModules = await this.moduleRepository.getORMMethods().find({
      relations: ['ParentModule', 'SubModules'],
    });

    const parentModules = allModules?.filter((module) => module.ParentModule === null);

    return parentModules;
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
