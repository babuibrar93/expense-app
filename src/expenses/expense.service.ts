import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseErrors, OrganizationErrors } from 'src/common/constants/basic.errors';
import { ExpenseRepository } from 'src/common/repositories/expense-repository';
import { OrganizationRepository } from 'src/common/repositories/organization.repository';
import { ExpenseFilter } from 'src/common/types/expense.enum';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { Brackets } from 'typeorm';
import { GetAllExpenseDto, GetExpenseStatsDto } from './dtos/expense.all.dto';
import { CreateExpenseDto, UpdateExpenseDto } from './dtos/expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly organizationRepository: OrganizationRepository
  ) {}

  async findOrganizationById(organizationId: string) {
    const organization = await this.organizationRepository.findOneRecord({
      Id: organizationId,
    });
    if (!organization) throw new NotFoundException(OrganizationErrors.ORGANIZATION_NOT_FOUND);

    return organization;
  }

  async create(createExpenseDto: CreateExpenseDto, currentUser: UserEntity) {
    const { Title, OrganizationId } = createExpenseDto;

    const organization = await this.findOrganizationById(OrganizationId);

    const alreadyExist = await this.expenseRepository.findOneRecord({ Title });
    if (alreadyExist) throw new BadRequestException(ExpenseErrors.EXPENSE_NOT_FOUND);

    return this.expenseRepository.getORMMethods().save({
      ...createExpenseDto,
      CreatedBy: currentUser,
      Organization: organization,
    });
  }

  async update(Id: string, updateExpenseDto: UpdateExpenseDto) {
    const { OrganizationId, ...rest } = updateExpenseDto;

    await this.findOrganizationById(OrganizationId);

    const expense = await this.expenseRepository.findOneRecord({ Id });

    Object.assign(expense, rest);
    return this.expenseRepository.getORMMethods().save(expense);
  }

  async findExpenseById(OrganizationId: string, Id: string) {
    await this.findOrganizationById(OrganizationId);

    const expense = await this.expenseRepository.findOneRecord({
      Id,
      Organization: { Id: OrganizationId },
    });
    if (!expense) throw new NotFoundException(ExpenseErrors.EXPENSE_NOT_FOUND);
    return expense;
  }

  async findAll(organizationId: string, query: GetAllExpenseDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'CreatedAt',
      order = 'DESC',
      maxAmount,
      minAmount,
      startDate,
      endDate,
      category,
      status,
      currency,
    } = query;

    await this.findOrganizationById(organizationId);

    const queryBuilder = this.expenseRepository
      .getORMMethods()
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.Organization', 'organization')
      .where('organization.Id = :organizationId', { organizationId });

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('expense.Title LIKE :search', { search: `%${search}%` }).orWhere(
            'expense.Description LIKE :search',
            { search: `%${search}%` }
          );
        })
      );
    }

    if (status) queryBuilder.andWhere('expense.Status = :status', { status });
    if (currency) queryBuilder.andWhere('expense.Currency = :currency', { currency });
    if (category) queryBuilder.andWhere('expense.Category = :category', { category });
    if (minAmount) queryBuilder.andWhere('expense.Amount >= :minAmount', { minAmount });
    if (maxAmount) queryBuilder.andWhere('expense.Amount <= :maxAmount', { maxAmount });
    if (startDate) queryBuilder.andWhere('expense.ExpenseDate >= :startDate', { startDate });
    if (endDate) queryBuilder.andWhere('expense.ExpenseDate <= :endDate', { endDate });

    const [expenses, total] = await queryBuilder
      .orderBy(`expense.${sortBy}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { total, page, limit, totalPages: Math.ceil(total / limit), expenses };
  }

  async remove(organizationId: string, id: string) {
    const expense = await this.findExpenseById(organizationId, id);
    await this.expenseRepository.getORMMethods().softDelete({ Id: expense.Id });
    return true;
  }

  async getExpenseStats(organizationId: string, query?: GetExpenseStatsDto) {
    const { filter } = query;
    await this.findOrganizationById(organizationId);

    const queryBuilder = this.expenseRepository
      .getORMMethods()
      .createQueryBuilder('expense')
      .leftJoin('expense.Organization', 'organization')
      .where('organization.Id = :organizationId', { organizationId });

    // Apply date filter
    if (filter === ExpenseFilter.WEEK) {
      queryBuilder.andWhere('expense.ExpenseDate >= DATEADD(WEEK, -1, GETDATE())');
    } else if (filter === ExpenseFilter.MONTH) {
      queryBuilder.andWhere('expense.ExpenseDate >= DATEADD(MONTH, -1, GETDATE())');
    } else if (filter === ExpenseFilter.YEAR) {
      queryBuilder.andWhere('expense.ExpenseDate >= DATEADD(YEAR, -1, GETDATE())');
    }

    // Total Expenses Count & Amount
    const totalStats = await queryBuilder
      .select('COUNT(expense.Id)', 'totalCount')
      .addSelect('SUM(expense.Amount)', 'totalAmount')
      .getRawOne();

    // Count by Status (Approved, Pending, Rejected)
    const statusStats = await queryBuilder
      .select('expense.Status', 'status')
      .addSelect('COUNT(expense.Id)', 'count')
      .groupBy('expense.Status')
      .getRawMany();

    // Category-wise Expense Breakdown
    const categoryStats = await queryBuilder
      .select('expense.Category', 'category')
      .addSelect('SUM(expense.Amount)', 'totalAmount')
      .groupBy('expense.Category')
      .getRawMany();

    // Monthly Expense Trend
    const monthlyStats = await queryBuilder
      .select("FORMAT(expense.ExpenseDate, 'yyyy-MM') AS month")
      .addSelect('SUM(expense.Amount) AS totalAmount')
      .groupBy("FORMAT(expense.ExpenseDate, 'yyyy-MM')")
      // .orderBy('ExpenseDate', 'ASC')
      .getRawMany();

    // Currency-wise Expense Summary
    const currencyStats = await queryBuilder
      .select('expense.Currency', 'currency')
      .addSelect('SUM(expense.Amount)', 'totalAmount')
      .groupBy('expense.Currency')
      .getRawMany();

    return {
      total: {
        count: Number(totalStats?.totalCount) || 0,
        amount: Number(totalStats?.totalAmount) || 0,
      },
      status: statusStats,
      categories: categoryStats,
      monthlyTrends: monthlyStats,
      currencySummary: currencyStats,
    };
  }
}
