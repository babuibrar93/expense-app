import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AuthErrors } from 'src/common/constants/auth.errors';
import { UserRepository } from 'src/common/repositories/user.repository';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ILoginResponse, IOAuthUser } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private auth0Domain: string;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService
  ) {
    this.auth0Domain = this.configService.get<string>('AUTH0_DOMAIN');
    this.clientId = this.configService.get<string>('AUTH0_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('AUTH0_CLIENT_SECRET');
    this.redirectUri = this.configService.get<string>('AUTH0_CALLBACK_URL');
  }

  /**
   * Handles user registration.
   *
   * @param data - The registration details including email and password.
   * @returns A promise resolving to the newly created user entity.
   * @throws ConflictException if the email is already in use.
   */
  async register(data: RegisterDto): Promise<UserEntity> {
    const { Email, Password } = data;

    const user = await this.userRepository.findByField('Email', Email);
    if (user) throw new ConflictException(AuthErrors.EMAIL_IN_USE);

    const hashPassword = await this.userRepository.hashPassword(Password);

    const savedUser = await this.userRepository.saveEntity({
      ...data,
      Password: hashPassword,
    } as unknown as UserEntity);

    return this.userRepository.findById(savedUser?.Id);
  }

  /**
   * Handles user login.
   *
   * @param data - The login credentials including email and password.
   * @returns A promise resolving to an object containing the authenticated user and JWT token.
   * @throws UnauthorizedException if the credentials are invalid.
   */
  async login(data: LoginDto): Promise<ILoginResponse> {
    const { Email, Password } = data;

    const user = await this.userRepository.findByField('Email', Email);
    if (!user) throw new UnauthorizedException(AuthErrors.INVALID_CREDENTIALS);

    const matchedPassword = await this.userRepository.comparePassword(Password, user.Password);
    if (!matchedPassword) throw new UnauthorizedException(AuthErrors.INVALID_CREDENTIALS);

    const token = await this.userRepository.generateAccessToken(user);

    const savedUser = await this.userRepository.findById(user?.Id);
    return { user: savedUser, token };
  }

  /**
   * Validates and handles social login, checks if user exists, and saves the new user if necessary.
   *
   * @param socialUser The user information obtained from the social login provider (e.g., Facebook, Google).
   * @returns {ILoginResponse} Returns the user data along with the generated access token.
   */
  async validateSocialLogin(socialUser: IOAuthUser): Promise<ILoginResponse> {
    const { emails, id, provider, displayName } = socialUser;

    if (!id || !emails) throw new Error(AuthErrors.INVALID_OAUTH);

    let user = await this.userRepository.findOneByFields({ Email: String(emails) });

    const token = await this.userRepository.generateAccessToken(user);
    user = await this.userRepository.findById(user?.Id);

    if (!user) {
      user = await this.userRepository.saveEntity({
        ProviderId: id,
        Email: emails,
        FullName: displayName || '',
        Provider: provider,
      } as unknown as UserEntity);
    } else return { user, token };

    return { user, token };
  }

  // Exchange the authorization code for an access token
  async getAccessToken(code: string): Promise<string> {
    try {
      const response = await axios.post(
        `https://${this.auth0Domain}/oauth/token`,
        {
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          redirect_uri: this.redirectUri,
          scope: 'openid profile email', // Make sure this includes 'email' scope,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const { access_token } = response.data;
      return access_token;
    } catch (error) {}
  }

  // Fetch user info using the access token
  async getUserInfo(accessToken: string): Promise<any> {
    const response = await axios.get(`https://${this.auth0Domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }
}
