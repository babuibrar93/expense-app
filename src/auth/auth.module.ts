import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/common/repositories/user.repository';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RoleRepository } from 'src/common/repositories/role.repository';
import { UserOrganizationRepository } from 'src/common/repositories/user-organization.repository';
import { UserOrganizationRoleRepository } from 'src/common/repositories/user-organization-role.repository';
import { OrganizationRepository } from 'src/common/repositories/organization.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    GithubStrategy,
    UserRepository,
    BcryptService,
    RoleRepository,
    OrganizationRepository,
    UserOrganizationRepository,
    UserOrganizationRoleRepository,
  ],
  exports: [JwtModule, JwtStrategy, PassportModule],
})
export class AuthModule {}
