import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AUTH_TOKEN } from 'src/common/constants/basic.constant';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { AuthenticatedRequest } from 'src/common/types/request.interface';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {}

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Login with Google' })
  googleAuth() {
    return new ApiResponse(true, HttpStatus.OK, 'Redirects to Google login');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiExcludeEndpoint()
  async googleAuthRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const token = (req.user as any).token;

    // Store JWT in HTTP-Only Cookie
    res.cookie(AUTH_TOKEN, token, {
      httpOnly: true, // Secure cookie (not accessible by JavaScript)
      secure: false, // Set to `true` in production with HTTPS
      sameSite: 'lax', // Cookie accessible from all routes,
      path: '/', // Cookie accessible from all routes
    });

    // Redirect to frontend home page
    res.redirect(this.configService.get<string>('FRONTEND_URL'));
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({ summary: 'Login with Facebook' })
  facebookAuth() {
    return new ApiResponse(true, HttpStatus.OK, 'Redirects to Facebook login');
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Facebook auth callback' })
  async facebookAuthRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const token = (req.user as any).token;

    // Store JWT in HTTP-Only Cookie
    res.cookie(AUTH_TOKEN, token, {
      httpOnly: true, // Secure cookie (not accessible by JavaScript)
      secure: false, // Set to `true` in production with HTTPS
      path: '/', // Cookie accessible from all routes
    });

    // Redirect to frontend home page
    res.redirect(this.configService.get<string>('FRONTEND_URL'));
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Login with GitHub' })
  githubAuth() {
    return new ApiResponse(true, HttpStatus.OK, 'Redirects to Github login');
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'GitHub auth callback' })
  async githubAuthRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const token = (req.user as any).token;

    // Store JWT in HTTP-Only Cookie
    res.cookie(AUTH_TOKEN, token, {
      httpOnly: true, // Secure cookie (not accessible by JavaScript)
      secure: false, // Set to `true` in production with HTTPS
      path: '/', // Cookie accessible from all routes
    });

    // Redirect to frontend home page
    res.redirect(this.configService.get<string>('FRONTEND_URL'));
  }

  @Get('token')
  getToken(@Req() req: Request) {
    return this.authService.getTokenFromCookie(req);
  }
}
