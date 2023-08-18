import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto';
import { MessageSerialization } from './serialization';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}
  @Get('conversation/:conversationId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all messages in conversation success',
    type: [MessageSerialization],
    isArray: true,
  })
  @ApiOperation({ summary: 'Get all messages in conversation' })
  getAllMessagesInConversation(
    @Param('conversationId') conversationId: string,
  ) {
    return this.messageService.getAllMessagesInConversation(conversationId);
  }
  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: MessageSerialization,
    description: 'Create conversation success',
  })
  @ApiOperation({ summary: 'Create new conversation' })
  createConversation(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.createMessage(createMessageDto);
  }
}
