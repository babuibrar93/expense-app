import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
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
  @ApiProperty({
    description: 'Title of the expense',
    example: 'Office Supplies',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  Title: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the expense (optional)',
    example: 'Purchased printer cartridges',
    maxLength: 500,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(0, 500)
  Description?: string;

  @ApiProperty({
    description: 'Amount spent on the expense',
    example: 150.75,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(9999999999.99) // Prevents unrealistic amounts
  Amount: number;

  @ApiProperty({
    description: 'Currency in which the expense is recorded',
    example: 'USD',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  Currency: string;

  @ApiProperty({
    description: 'Date when the expense was made',
    example: '2024-02-27',
  })
  @IsNotEmpty()
  ExpenseDate: Date;

  @ApiProperty({
    description: 'Category of the expense',
    example: 'Office Supplies',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  Category: string;

  @ApiPropertyOptional({
    description: 'Status of the expense',
    example: ExpenseStatus.PENDING,
    enum: ExpenseStatus,
    default: ExpenseStatus.PENDING,
  })
  @IsEnum(ExpenseStatus)
  @IsOptional()
  Status?: ExpenseStatus;

  @ApiProperty({ description: 'Organization ID', example: 'b5fcb3a2-3c50-4f94-bf65-d2e9d9a4ebf7' })
  @IsUUID()
  @IsNotEmpty()
  OrganizationId: string;
}

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}
