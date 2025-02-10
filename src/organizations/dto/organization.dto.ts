import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'DevVerge', description: 'Name of the organization' })
  @IsString()
  @IsNotEmpty({ message: 'Organization name is required' })
  Name: string;

  @ApiPropertyOptional({
    example: 'Software Development Company',
    description: 'Description of the organization',
    required: false,
  })
  @IsString()
  @IsOptional()
  Description?: string;
}

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @ApiProperty({ example: '1', description: 'ID of the organization to update' })
  Id: string;
}
