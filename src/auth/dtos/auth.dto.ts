import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID, Matches, MinLength } from 'class-validator';

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

export class RegisterDto extends LoginDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
    required: true,
  })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  FullName: string;
}

export class ForgetPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  Email: string;
}

export class AddUserDto extends RegisterDto {
  @ApiProperty({
    example: 'F7C8423E-F36B-1410-8074-00FF2F75E0BD',
    description: 'Id of role to assign user',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  OrganizationId: string;

  @ApiProperty({
    example: 'F7C8423E-F36B-1410-8074-00FF2F75E0BD',
    description: 'Id of role to assign user',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  RoleId: string;
}

export class UpdateUserDto extends PartialType(AddUserDto) {}
