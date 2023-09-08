import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { FirebaseModule } from '../lib/firebase/firebase.module';
import { MailModule } from '../lib/mail/mail.module';
import { UtilModule } from '../util/util.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisCacheModule } from '../lib/redis-cache/redis-cache.module';

@Module({
  imports: [
    DatabaseModule,
    FirebaseModule,
    RedisCacheModule,
    MailModule,
    UtilModule,
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
