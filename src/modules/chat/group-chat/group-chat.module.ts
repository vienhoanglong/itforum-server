import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { GroupChatController } from './group-chat.controller';
import { GroupChatService } from './group-chat.service';
import { UtilModule } from 'src/modules/util/util.module';
@Module({
  imports: [DatabaseModule, UtilModule],
  controllers: [GroupChatController],
  providers: [GroupChatService],
})
export class GroupChatModule {}
