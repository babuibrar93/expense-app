import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin', description: 'Role name' })
  @IsNotEmpty({ message: 'Role name is required' })
  @IsString()
  Name: string;
}

export class updateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({ example: '1', description: 'ID of the role to update' })
  Id: string;
}
