import { Body, Controller, Post } from '@nestjs/common';
import { ChatGPTDto } from './chatgpt.dto';
import { ChatGPTService } from './chatgpt.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('chat-gpt')
@ApiTags('ChatGPT')
export class ChatGPTController {
  constructor(private readonly chatGPTService: ChatGPTService) {}

  @Post()
  sendMessage(@Body() message: ChatGPTDto): Promise<string> {
    return this.chatGPTService.sendMessage(message.message);
  }
}
