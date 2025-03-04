import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { RegisterDto } from 'src/auth/dtos/auth.dto';

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
