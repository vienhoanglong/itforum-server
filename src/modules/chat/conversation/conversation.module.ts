import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { UserModule } from 'src/modules/user/user.module';
import { MessageModule } from '../message/message.module';
import { FirebaseModule } from 'src/modules/lib/firebase/firebase.module';

@Module({
  imports: [DatabaseModule, UserModule, MessageModule, FirebaseModule],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
