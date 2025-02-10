import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';

/** Login DTO */
export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  Email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd!',
    description: 'The password of the user (must be at least 6 characters)',
    required: true,
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  Password: string;
}

/** DTO for mapping organization & roles */
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

/** Registration DTO */
export class RegisterDto extends LoginDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
    required: true,
  })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  FullName: string;

  @ApiProperty({
    description: 'Array of organizations with assigned roles',
    type: [OrganizationRoleDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrganizationRoleDto)
  Organizations: OrganizationRoleDto[];
}

export class ForgetPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
