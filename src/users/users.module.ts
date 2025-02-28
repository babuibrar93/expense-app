import { Module } from '@nestjs/common';
import { UserRepository } from 'src/common/repositories/user.repository';
import { UserController } from './users.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { BcryptService } from 'src/common/services/bcrypt.service';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, BcryptService],
  exports: [UserRepository],
})
export class UserModule {}
