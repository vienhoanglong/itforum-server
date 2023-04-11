import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { ChatGPTController } from './chatgpt.controller';
import { ChatGPTService } from './chatgpt.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ChatGPTController],
  providers: [ChatGPTService],
})
export class ChatGPTModule {}
