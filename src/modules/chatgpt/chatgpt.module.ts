import { Module } from '@nestjs/common';
import { ChatGPTController } from './chatgpt.controller';
import { ChatGPTService } from './chatgpt.service';

@Module({
  imports: [],
  controllers: [ChatGPTController],
  providers: [ChatGPTService],
  exports: [ChatGPTService],
})
export class ChatGPTModule {}
