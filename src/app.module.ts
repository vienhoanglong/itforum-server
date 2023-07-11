import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import * as dotenv from 'dotenv';
import { UserModule } from './modules/user/user.module';
dotenv.config();
@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, AuthModule, UserModule],
})
export class AppModule {}
