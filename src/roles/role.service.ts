import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RoleError } from 'src/common/constants/basic.errors';
import { RoleRepository } from 'src/common/repositories/role.repository';
import { CreateRoleDto, updateRoleDto } from './dto/role.dto';
import { RoleEntity } from 'src/core/database/entities/role.entity';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create(createRoleDto: CreateRoleDto) {
    const { Name } = createRoleDto;

    const alreadExists = await this.roleRepository.findOne({ Name });
    if (alreadExists) throw new BadRequestException(RoleError.alreadyExists);

    return await this.roleRepository.saveEntity({ Name } as unknown as RoleEntity);
  }

  async getAll(): Promise<RoleEntity[]> {
    return await this.roleRepository.findAll();
  }

  async getRoleById(id: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({ Id: id });
    if (!role) throw new NotFoundException(RoleError.notFound);
    return role;
  }

  async update(id: string, dto: updateRoleDto): Promise<RoleEntity> {
    const role = await this.getRoleById(id);
    Object.assign(role, dto);
    return await this.roleRepository.saveEntity(role);
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.getRoleById(id);
    await this.roleRepository.removeEntity(role);
  }
}
