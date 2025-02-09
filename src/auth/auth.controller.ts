import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { AuthenticatedRequest } from 'src/common/types/request.interface';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register your account' })
  async register(@Body() body: RegisterDto): Promise<ApiResponse<UserEntity>> {
    const response = await this.authService.register(body);
    return new ApiResponse(true, HttpStatus.CREATED, 'User registered successfully', response);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login into your account' })
  async login(@Body() body: LoginDto) {
    const response = await this.authService.login(body);
    return new ApiResponse(true, HttpStatus.OK, 'User logged in successfully', response);
  }

  @Get('auth0')
  @UseGuards(AuthGuard('auth0'))
  @ApiOperation({ summary: 'Login with auth0' })
  githubAuth() {
    return new ApiResponse(true, HttpStatus.OK, 'Redirects to auth0 login');
  }

  @Get('auth0/callback')
  @UseGuards(AuthGuard('auth0'))
  @ApiOperation({ summary: 'Auth0 callback' })
  async authCallback(@Req() req: AuthenticatedRequest) {
    return new ApiResponse(true, HttpStatus.OK, 'Auth0 authentication successful', req.user);
  }
}
