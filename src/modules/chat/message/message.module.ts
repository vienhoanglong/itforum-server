import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { FirebaseModule } from 'src/modules/lib/firebase/firebase.module';

@Module({
  imports: [DatabaseModule, FirebaseModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
