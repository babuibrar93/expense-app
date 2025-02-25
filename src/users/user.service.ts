import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthError } from 'src/common/constants/basic.errors';
import { UserRepository } from 'src/common/repositories/user.repository';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { GetUsersDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly userRepository: UserRepository
  ) {}

  async findAllUsers(query: GetUsersDto) {
    const { page, limit, search, sortBy = 'CreatedAt', order = 'DESC' } = query;

    const queryBuilder = this.userRepository
      .getORMMethods()
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.UserOrganization', 'userOrganization')
      .leftJoinAndSelect('userOrganization.Organization', 'organization')
      .leftJoinAndSelect('userOrganization.UserOrganizationRole', 'userOrganizationRole')
      .leftJoinAndSelect('userOrganizationRole.Role', 'role');

    if (search) {
      queryBuilder.andWhere(
        '(user.Name ILIKE :search OR user.Email ILIKE :search OR user.FullName ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply sorting dynamically
    queryBuilder.orderBy(`user.${sortBy}`, order as 'ASC' | 'DESC');

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { users, total };
  }

  async findOneUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneRecord({ Id: id }, { relations: true });
    if (!user) throw new NotFoundException(AuthError.UserNotFound);
    return user;
  }

  async updateUserById(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const { Password } = updateUserDto;

    const hashedPassword = await this.bcryptService.hashPassword(Password);

    const user = await this.userRepository.findOneRecord({ Id: id });
    if (!user) throw new NotFoundException(AuthError.UserNotFound);
    Object.assign(user, { ...updateUserDto, Password: hashedPassword });
    return await this.userRepository.getORMMethods().save(user);
  }

  async removeUser(id: string): Promise<boolean> {
    const user = await this.userRepository.findOneRecord({ Id: id });
    if (!user) throw new NotFoundException(AuthError.UserNotFound);

    await this.userRepository.getORMMethods().softDelete(user.Id);
    return true;
  }
}
