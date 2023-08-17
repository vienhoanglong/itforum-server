import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
