import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { FirebaseModule } from '../lib/firebase/firebase.module';
import { MailModule } from '../lib/mail/mail.module';

@Module({
  imports: [DatabaseModule, FirebaseModule, MailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
