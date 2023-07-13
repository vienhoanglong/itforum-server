import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [DatabaseModule, FirebaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
