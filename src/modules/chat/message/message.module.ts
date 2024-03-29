import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { FirebaseModule } from 'src/modules/lib/firebase/firebase.module';
import { ChatGPTModule } from 'src/modules/chatgpt/chatgpt.module';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [DatabaseModule, FirebaseModule, ChatGPTModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
  exports: [MessageService, MessageGateway],
})
export class MessageModule {}
