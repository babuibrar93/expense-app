import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({ example: 'User Management' })
  @IsString()
  @IsNotEmpty()
  Name: string;

  @ApiPropertyOptional({ example: 'UUID-of-Parent-Module', required: false })
  @IsUUID()
  @IsOptional()
  ParentId?: string;
}

export class UpdateModuleDto extends PartialType(CreateModuleDto) {}
