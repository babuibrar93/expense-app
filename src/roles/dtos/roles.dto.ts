import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

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

export class ModulePermissionsDto {
  @ApiProperty({
    description: 'UUID of the module',
    example: 'DEC8423E-F36B-1410-8074-00FF2F75E0BD',
  })
  @IsNotEmpty()
  @IsUUID()
  ModuleId: string;

  @ApiProperty({
    description: 'List of permissions assigned to the module',
    example: ['READ', 'WRITE', 'DELETE'],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  Permissions: string[];
}

export class AssignModulesToRoleDto {
  @ApiProperty({
    description: 'UUID of the role to be assigned to the modules',
    example: 'F7C8423E-F36B-1410-8074-00FF2F75E0BD',
  })
  @IsUUID()
  @IsNotEmpty()
  RoleId: string;

  @ApiProperty({
    description: 'List of modules and their respective permissions to assign to the role',
    type: [ModulePermissionsDto], // Correctly defines it as an array of DTOs
  })
  @IsArray()
  @ArrayNotEmpty()
  ModulePermissions: ModulePermissionsDto[];
}
