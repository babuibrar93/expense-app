import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ExpenseStatus } from 'src/common/types/expense.enum';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Office Supplies', description: 'Title of the expense' })
  @IsNotEmpty()
  @IsString()
  Title: string;

  @ApiPropertyOptional({
    example: 'Purchased printer for office use',
    description: 'Description of the expense',
  })
  @IsOptional()
  @IsString()
  Description?: string;

  @ApiProperty({ example: 1500.75, description: 'Amount of the expense' })
  @IsNotEmpty()
  @IsNumber()
  Amount: number;

  @ApiProperty({ example: 'USD', description: 'Currency of the expense' })
  @IsNotEmpty()
  @IsString()
  Currency: string;

  @ApiProperty({
    example: '2025-02-27',
    description: 'Date of the expense',
    type: String,
    format: 'date',
  })
  @IsNotEmpty()
  @IsDate()
  ExpenseDate: Date;

  @ApiPropertyOptional({
    enum: ExpenseStatus,
    example: ExpenseStatus.PENDING,
    description: 'Status of the expense',
  })
  @IsOptional()
  @IsEnum(ExpenseStatus)
  Status?: ExpenseStatus;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Organization ID' })
  @IsNotEmpty()
  @IsUUID()
  OrganizationId: string;

  @ApiProperty({
    example: '660e8400-e29b-41d4-a716-446655440000',
    description: 'Type ID (Expense or Revenue)',
  })
  @IsNotEmpty()
  @IsUUID()
  TypeId: string;

  @ApiProperty({
    example: '770e8400-e29b-41d4-a716-446655440000',
    description: 'Category ID of the expense',
  })
  @IsNotEmpty()
  @IsUUID()
  CategoryId: string;
}

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}
