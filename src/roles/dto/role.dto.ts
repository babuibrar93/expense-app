import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

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

export class AssignRoleDto {
  @ApiProperty({
    description: 'UUID of the user to whom the role will be assigned',
    example: 'C9C8423E-F36B-1410-8074-00FF2F75E0BD',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'UUID of the organization where the user belongs',
    example: 'DEC8423E-F36B-1410-8074-00FF2F75E0BD',
  })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({
    description: 'UUID of the role to be assigned to the user',
    example: 'F7C8423E-F36B-1410-8074-00FF2F75E0BD',
  })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;
}

