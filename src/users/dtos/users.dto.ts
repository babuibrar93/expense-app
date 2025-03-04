import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class FindUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'ID is required.' })
  id: string;
}

export class OrganizationRoleDto {
  @ApiProperty({
    example: '1',
    description: 'ID of the organization',
    required: true,
  })
  @IsNotEmpty({ message: 'Organization ID is required' })
  @IsString()
  OrganizationId: string;

  @ApiProperty({
    example: ['1', '2'],
    description: 'Array of role IDs assigned within this organization',
    required: true,
    type: [String],
  })
  @IsArray({ message: 'Roles must be an array' })
  @IsString({ each: true, message: 'Each role ID must be a string' })
  Roles: string[];
}

export class GetUsersDto {
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
