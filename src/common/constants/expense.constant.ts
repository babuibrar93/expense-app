import { ExpenseTypeEnum } from '../types/expense.enum';

export const types = [{ Name: 'Expense' }, { Name: 'Revenue' }];

export const categories = [
  { Name: 'Employee Expenses', Type: ExpenseTypeEnum.EXPENSE },
  { Name: 'Office Expenses', Type: ExpenseTypeEnum.EXPENSE },
  { Name: 'Technology Expenses', Type: ExpenseTypeEnum.EXPENSE },
  { Name: 'Marketing Expenses', Type: ExpenseTypeEnum.EXPENSE },
  { Name: 'Travel Expenses', Type: ExpenseTypeEnum.EXPENSE },
  { Name: 'Legal Expenses', Type: ExpenseTypeEnum.EXPENSE },
  { Name: 'Client Expenses', Type: ExpenseTypeEnum.EXPENSE },
  { Name: 'R&D Expenses', Type: ExpenseTypeEnum.EXPENSE },
  { Name: 'Miscellaneous Expenses', Type: ExpenseTypeEnum.EXPENSE },
  { Name: 'Project Expenses', Type: ExpenseTypeEnum.EXPENSE },
  { Name: 'Commission Expenses', Type: ExpenseTypeEnum.EXPENSE },
  { Name: 'Grants Expenses', Type: ExpenseTypeEnum.EXPENSE },
  { Name: 'Investment Expenses', Type: ExpenseTypeEnum.EXPENSE },

  { Name: 'Sales Revenue', Type: ExpenseTypeEnum.REVENUE },
  { Name: 'Project Revenue', Type: ExpenseTypeEnum.REVENUE },
  { Name: 'Licensing Revenue', Type: ExpenseTypeEnum.REVENUE },
  { Name: 'Commission Revenue', Type: ExpenseTypeEnum.REVENUE },
  { Name: 'Investment Revenue', Type: ExpenseTypeEnum.REVENUE },
  { Name: 'Grants Revenue', Type: ExpenseTypeEnum.REVENUE },
  { Name: 'Advertising Revenue', Type: ExpenseTypeEnum.REVENUE },
  { Name: 'Franchise Revenue', Type: ExpenseTypeEnum.REVENUE },
  { Name: 'Consulting Revenue', Type: ExpenseTypeEnum.REVENUE },
  { Name: 'Subscription Revenue', Type: ExpenseTypeEnum.REVENUE },
  { Name: 'Miscellaneous Revenue', Type: ExpenseTypeEnum.REVENUE },
];
