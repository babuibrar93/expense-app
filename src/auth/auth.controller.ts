import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AUTH_TOKEN } from 'src/common/constants/basic.constant';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { ApiResponse } from 'src/common/dtos/api-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { Role } from 'src/common/types/basic.enum';
import { AuthenticatedRequest } from 'src/common/types/request.interface';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { AuthService } from './auth.service';
import { AddUserDto, LoginDto, RegisterDto, UpdateUserDto } from './dtos/auth.dto';

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
  @ApiOperation({ summary: 'Get token when login with social auth' })
  getToken(@Req() req: Request) {
    return this.authService.getTokenFromCookie(req);
  }

  @Post('add-user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Add user to organization and assign role' })
  async addUserToOrganizationAndAssignRole(
    @Body() addUserDto: AddUserDto,
    @CurrentUser() user: UserEntity,
    @Req() request: Request
  ) {
    const response = await this.authService.addUserToOrganizationAndAssignRole(
      addUserDto,
      user,
      request
    );
    return new ApiResponse(
      true,
      HttpStatus.CREATED,
      'User successfully added to organization and assigned role.',
      response
    );
  }

  @Patch('update-user/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({ summary: 'Update user role in organization' })
  async updateUserRoleInOrganization(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: UserEntity,
    @Req() req: Request
  ) {
    const response = await this.authService.updateUserRoleInOrganization(
      userId,
      updateUserDto,
      user,
      req
    );
    return new ApiResponse(
      true,
      HttpStatus.CREATED,
      'User role is successfully updated.',
      response
    );
  }
}
