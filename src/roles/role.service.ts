import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RoleError } from 'src/common/constants/basic.errors';
import { RoleRepository } from 'src/common/repositories/role.repository';
import { RoleEntity } from 'src/core/database/entities/role.entity';
import { CreateRoleDto, updateRoleDto } from './dto/role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const { Name } = createRoleDto;

    const alreadyExists = await this.roleRepository.findOneRecord({ Name });
    if (alreadyExists) throw new BadRequestException(RoleError.alreadyExists);

    return this.roleRepository.getORMMethods().save({ Name });
  }

  async getAll(): Promise<RoleEntity[]> {
    return this.roleRepository.getORMMethods().find();
  }

  async getRoleById(Id: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOneRecord({ Id });
    if (!role) throw new NotFoundException(RoleError.notFound);
    return role;
  }

  async update(id: string, dto: updateRoleDto): Promise<RoleEntity> {
    const role = await this.getRoleById(id);
    Object.assign(role, dto);
    return this.roleRepository.getORMMethods().save(role);
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.getRoleById(id);
    await this.roleRepository.getORMMethods().delete(role.Id);
  }
}
