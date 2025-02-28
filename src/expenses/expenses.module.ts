import { Module } from '@nestjs/common';
import { ExpenseController } from './expenses.controller';
import { ExpenseService } from './expense.service';
import { ExpenseRepository } from 'src/common/repositories/expense-repository';
import { UserRepository } from 'src/common/repositories/user.repository';
import { OrganizationRepository } from 'src/common/repositories/organization.repository';

@Module({
  imports: [],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseRepository, UserRepository, OrganizationRepository],
  exports: [],
})
export class ExpenseModule {}
