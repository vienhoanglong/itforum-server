import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from '../../common/strategy/accessToken.strategy';
import { RefreshTokenStrategy } from '../../common/strategy/refreshToken.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from 'src/common/strategy/google.strategy';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({}),
    UserModule,
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
