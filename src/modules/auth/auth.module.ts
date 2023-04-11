import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
