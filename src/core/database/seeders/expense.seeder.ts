import { Injectable } from '@nestjs/common';
import { categories } from 'src/common/constants/expense.constant';
import { DataSource } from 'typeorm';
import { ExpenseCategoryEntity } from '../entities/expense-category.entity';
import { ExpenseTypeEntity } from '../entities/expense-type.entity';

@Injectable()
export class ExpenseSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const expenseCategory = await this.dataSource.getRepository(ExpenseCategoryEntity);
    const expenseType = await this.dataSource.getRepository(ExpenseTypeEntity);

    try {
      for (const category of categories) {
        const alreadyExistType = await expenseType.findOne({ where: { Name: category.Type } });
        if (!alreadyExistType) await expenseType.save({ Name: category.Type });

        const alreadyExistsCategory = await expenseCategory.findOne({
          where: { Name: category.Name, Type: alreadyExistType },
        });
        if (!alreadyExistsCategory)
          await expenseCategory.save({
            Name: category.Name,
            Type: alreadyExistType,
          });
      }

      console.log('Expense seeded successfully.');
    } catch (error) {
      console.log('Error occured in seeding expense.', error);
    }
  }
}
