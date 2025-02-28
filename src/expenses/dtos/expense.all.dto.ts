import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { GetAllDto } from 'src/common/dtos/get-all-api.dto';
import { ExpenseFilter } from 'src/common/types/expense.enum';

export class GetAllExpenseDto extends PartialType(GetAllDto) {
  @ApiPropertyOptional({ description: 'Minimum amount filter', example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum amount filter', example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxAmount?: number;

  @ApiPropertyOptional({ description: 'Currency filter', example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Start date filter (YYYY-MM-DD)', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date filter (YYYY-MM-DD)', example: '2024-01-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Category filter', example: 'Food' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Expense status filter', example: 'Pending' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class GetExpenseStatsDto {
  @ApiPropertyOptional({ description: 'Expense filter', example: 'WEEK' })
  @IsOptional()
  @IsEnum(ExpenseFilter, { message: 'filter must be one of: week, month, year' })
  filter?: ExpenseFilter;
}
