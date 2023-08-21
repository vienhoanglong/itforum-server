import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
