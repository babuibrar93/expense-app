import { Module } from '@nestjs/common';
import { ModuleRepository } from 'src/common/repositories/module.repository';
import { ModuleService } from './module.service';
import { ModuleController } from './modules.controller';

@Module({
  imports: [],
  controllers: [ModuleController],
  providers: [ModuleService, ModuleRepository],
  exports: [ModuleService],
})
export class ModuleModule {}
