import { Body, Controller, Post } from '@nestjs/common';
import { ChatGPTDto } from './chatgpt.dto';
import { ChatGPTService } from './chatgpt.service';

@Controller('chat-gpt')
export class ChatGPTController {
  constructor(private readonly chatGPTService: ChatGPTService) {}

  @Post()
  async sendMessage(@Body() message: ChatGPTDto): Promise<string> {
    const response = await this.chatGPTService.sendMessage(message.message);
    await this.chatGPTService.saveMessage(message.message);
    return response;
  }
}
