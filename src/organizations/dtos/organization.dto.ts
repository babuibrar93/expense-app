import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'DevVerge', description: 'Name of the organization' })
  @IsString()
  @IsNotEmpty({ message: 'Organization name is required' })
  Name: string;

  @ApiProperty({ example: 'DevVerge@example.com', description: 'Email of the organization' })
  @IsString()
  @IsNotEmpty({ message: 'Organization email is required' })
  Email: string;

  @ApiPropertyOptional({
    example: '+923012345678',
    description: 'Contact phone number of the organization',
  })
  @IsString()
  @IsOptional()
  Phone: string;

  @ApiPropertyOptional({
    example: 'Software Development Company',
    description: 'Description of the organization',
    required: false,
  })
  @IsString()
  @IsOptional()
  Description?: string;
}

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}

export class OrganizationIdDto {
  @ApiProperty({
    description: 'UUID of the user to whom the role will be assigned',
    example: 'C9C8423E-F36B-1410-8074-00FF2F75E0BD',
  })
  @IsUUID()
  @IsNotEmpty()
  Id: string;
}

export class GetOrganizationDto {
  @ApiPropertyOptional({ description: 'Page number for pagination', example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of records per page', example: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search keyword to filter users', example: 'John Doe' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Field to sort by', example: 'CreatedAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'CreatedAt';

  @ApiPropertyOptional({ description: 'Sort order (ASC or DESC)', example: 'DESC' })
  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC' = 'DESC';
}
