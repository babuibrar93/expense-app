import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthErrors } from 'src/common/constants/auth.errors';
import { UserRepository } from 'src/common/repositories/user.repository';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ILoginResponse, IOAuthUser } from './interfaces/auth.interface';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private auth0Domain;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService
  ) {
    this.auth0Domain = configService.get<string>('AUTH0_DOMAIN');
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
    const { emails, id, displayName } = socialUser;

    if (!id || !emails) throw new Error(AuthErrors.INVALID_OAUTH);

    let user = await this.userRepository.findOneByFields({ Email: String(emails) });

    const token = await this.userRepository.generateAccessToken(user);
    user = await this.userRepository.findById(user?.Id);

    if (!user) {
      user = await this.userRepository.saveEntity({
        Email: emails,
        FullName: displayName || '',
      } as unknown as UserEntity);
    } else return { user, token };

    return { user, token };
  }

  /**
   * Validates and handles social login, checks if user exists, and saves the new user if necessary.
   *
   * @param accessToken The accessToken obtained from the auth0 provider.
   * @returns {ILoginResponse} Returns the user data along with the generated access token.
   */
  async validateOAuthLogin(accessToken: string): Promise<ILoginResponse> {
    // Fetch user data from Auth0
    const auth0Response = await axios.get(`https://${this.auth0Domain}/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { email, name } = auth0Response.data;

    let user = await this.userRepository.findByField('Email', email);

    if (!user) {
      user = await this.userRepository.saveEntity({
        Email: email,
        FullName: name || '',
      } as unknown as UserEntity);
    }

    const token = await this.userRepository.generateAccessToken(user);

    return { user, token };
  }
}
