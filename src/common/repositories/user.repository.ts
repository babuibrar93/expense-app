import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { EntityManager } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    manager: EntityManager,
    private readonly jwtService: JwtService
  ) {
    super(UserEntity, manager);
  }

  // Find user by a specific field
  async findByField<K extends keyof UserEntity>(
    key: K,
    value: UserEntity[K]
  ): Promise<UserEntity | null> {
    return this.findOneByFields({ [key]: value });
  }

  async findById(id: string): Promise<UserEntity> {
    const response = this.findOneByFields({ Id: id });
    return plainToInstance(UserEntity, response);
  }

  // Hash password before inserting or updating user
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  // Validate password against hashed password
  async comparePassword(password: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }

  async generateAccessToken(user: UserEntity): Promise<string> {
    return this.jwtService.signAsync({
      userId: user?.Id,
    });
  }

  async generateRefreshToken(user: UserEntity): Promise<string> {
    return this.jwtService.signAsync({
      userId: user?.Id,
    });
  }
}
