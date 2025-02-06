import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { decode, JwtPayload } from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthErrors } from 'src/common/constants/auth.errors';
import { UserRepository } from 'src/common/repositories/user.repository';
import { EAuthProvider } from 'src/common/types/provider.enum';
import { UserEntity } from 'src/core/database/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private auth0Domain: string;
  private jwksClient: jwksClient.JwksClient;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        const decoded = decode(rawJwtToken, { complete: true });

        // Check if the token is an Auth0 token or a regular jwt token. If header contains kid key then it indeicated that it is Auth0 token else its a regular token
        if (decoded && decoded.header && decoded.header.kid) {
          this.getSigningKey(decoded.header.kid)
            .then((key) => done(null, key))
            .catch(() => done(new UnauthorizedException(AuthErrors.INVALID_AUTH0_TOKEN), null));
        } else {
          done(null, this.configService.get<string>('JWT_SECRET_KEY'));
        }
      },
    });

    this.auth0Domain = this.configService.get<string>('AUTH0_DOMAIN');
    this.jwksClient = jwksClient({
      jwksUri: `https://${this.auth0Domain}/.well-known/jwks.json`,
    });
  }

  async validate(payload: JwtPayload | any): Promise<UserEntity> {
    // If the token is from Auth0
    if (payload.iss && payload.iss.includes(this.auth0Domain)) {
      return await this.validateAuth0Token(payload);
    } else {
      // If it's a regular JWT from your system
      return await this.validateRegularToken(payload);
    }
  }

  private async validateAuth0Token(payload: any): Promise<UserEntity> {
    if (!payload.sub) throw new UnauthorizedException(AuthErrors.INVALID_AUTH0_TOKEN);

    let user = await this.userRepository.findOneByFields({ ProviderId: payload.sub });
    if (!user) {
      user = await this.userRepository.saveEntity({
        ProviderId: payload.sub,
        Email: payload.email || '',
        FullName: payload.name || '',
        Provider: EAuthProvider.AUTH0,
      } as unknown as UserEntity);
    }
    return user;
  }

  private async validateRegularToken(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.findById(payload.userId);
    if (!user) throw new UnauthorizedException('Invalid token');
    return user; // Automatically attaches `req.user`
  }

  private async getSigningKey(kid: string): Promise<string> {
    const key = await this.jwksClient.getSigningKey(kid);
    return key.getPublicKey();
  }
}
