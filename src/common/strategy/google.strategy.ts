import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('YOUR_CLIENT_ID'),
      clientSecret: configService.get<string>('YOUR_CLIENT_SECRET'),
      callbackURL: configService.get<string>('YOUR_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails, photos, id } = profile;
    const user = {
      ...profile,
      googleId: id,
      email: emails[0].value,
      avatar: photos[0].value,
      fullName: displayName,
      accessToken,
    };
    done(null, user);
  }
}
