import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { typeOrmConfig } from './core/config/typeorm.config';
import { ExpenseSeeder } from './core/database/seeders/expense.seeder';
import { SuperAdminSeeder } from './core/database/seeders/super-admin.seeder';
import { ExpenseModule } from './expenses/expenses.module';
import { ModuleModule } from './modules/modules.module';
import { OrganizationModule } from './organizations/organizations.module';
import { RoleModule } from './roles/roles.module';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    RoleModule,
    ModuleModule,
    ExpenseModule,
    OrganizationModule,
  ],
  providers: [JwtStrategy, SuperAdminSeeder, ExpenseSeeder],
  exports: [SuperAdminSeeder],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
