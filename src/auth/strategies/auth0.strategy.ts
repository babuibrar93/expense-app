import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class Auth0Strategy extends PassportStrategy(OAuth2Strategy, 'auth0') {
  constructor(
    configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      authorizationURL: `https://${configService.get<string>('AUTH0_DOMAIN')}/authorize`,
      tokenURL: `https://${configService.get<string>('AUTH0_DOMAIN')}/oauth/token`,
      clientID: configService.get<string>('AUTH0_CLIENT_ID'),
      clientSecret: configService.get<string>('AUTH0_CLIENT_SECRET'),
      callbackURL: configService.get<string>('AUTH0_CALLBACK_URL'),
      scope: 'openid email profile',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    console.log("🚀 ~ Auth0Strategy ~ validate ~ accessToken:", accessToken)
    try {
      const user = await this.authService.validateOAuthLogin(accessToken);
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
}
