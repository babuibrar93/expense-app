import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthError } from 'src/common/constants/basic.errors';
import { UserRepository } from 'src/common/repositories/user.repository';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ILoginResponse, IOAuthUser } from './interfaces/auth.interface';
import axios from 'axios';

@Injectable()
export class AuthService {
  private auth0Domain
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService
  ) {}

  async register(data: RegisterDto): Promise<UserEntity> {
    const { Email, Password } = data;

    // Check if user exists
    const existingUser = await this.userRepository.getORMMethods().findOne({ where: { Email } });
    if (existingUser) throw new ConflictException(AuthError.EmailAlreadyInUse);

    // Hash password and save user
    const hashedPassword = await this.bcryptService.hashPassword(Password);
    const newUser = await this.userRepository
      .getORMMethods()
      .save({ ...data, Password: hashedPassword });

    return newUser;
  }

  async login(data: LoginDto): Promise<ILoginResponse> {
    const { Email, Password } = data;

    // Check if user exists
    const user = await this.userRepository.findOneRecord({ Email });
    if (!user) throw new UnauthorizedException(AuthError.UserNotFound);

    // Verify password
    const matched = await this.bcryptService.comparePassword(Password, user.Password);
    if (!matched) throw new UnauthorizedException(AuthError.InvalidCredentials);

    // Generate token
    const token = this.generateAccessToken(user);

    return { user, token };
  }

  async validateSocialLogin(socialUser: IOAuthUser): Promise<ILoginResponse> {
    const { emails, id, displayName } = socialUser;
    if (!id || !emails) throw new BadRequestException(AuthError.InvalidOAuth);

    let user = await this.userRepository.findOneRecord({ Email: String(emails) });

    if (!user) {
      user = await this.userRepository.getORMMethods().save({
        Email: emails,
        FullName: displayName || '',
      } as UserEntity);
    }

    const token = this.generateAccessToken(user);

    return { user, token };
  }

  generateAccessToken(user: UserEntity): string {
    const payload = { id: user.Id, email: user.Email, role: user.FullName };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
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

    let user = await this.userRepository.findOneRecord({ Email: email });

    if (!user) {
      user = await this.userRepository.getORMMethods().save({
        Email: email,
        FullName: name || '',
      } as unknown as UserEntity);
    }

    const token = await this.generateAccessToken(user);

    return { user, token };
  }
}
