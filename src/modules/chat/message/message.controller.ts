import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MessageService } from './message.service';
import {
  CreateMessageAttachmentDto,
  CreateMessageDto,
  GetMessageDto,
} from './dto';
import { MessageSerialization } from './serialization';
import { FileInterceptor } from '@nestjs/platform-express';
import { MessageGateway } from './message.gateway';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(
    private messageService: MessageService,
    private messageGateway: MessageGateway,
  ) {}
  @Get('conversation')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all messages in conversation success',
    type: [MessageSerialization],
    isArray: true,
  })
  @ApiOperation({ summary: 'Get all messages in conversation' })
  getAllMessagesInConversation(@Query() getMessageDto: GetMessageDto) {
    const { conversationId, page, pageSize, oldestMessageTimestamp } =
      getMessageDto;
    return this.messageService.getAllMessagesInConversation(
      conversationId,
      page,
      pageSize,
      oldestMessageTimestamp,
    );
  }
  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: MessageSerialization,
    description: 'Create conversation success',
  })
  @ApiOperation({ summary: 'Create new conversation' })
  createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messageGateway.handleChatMessage(createMessageDto);
  }

  @Post('chat-gpt')
  @ApiResponse({
    status: HttpStatus.OK,
    type: MessageSerialization,
    description: 'Create new message chatgpt success',
  })
  @ApiOperation({ summary: 'Create new message chatgpt' })
  createMessageChatGPT(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.createMessageChatGpt(createMessageDto);
  }
  @Post('message-file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File/Image and Message Data',
    type: CreateMessageAttachmentDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MessageSerialization,
    description: 'Create message file success',
  })
  @ApiOperation({ summary: 'Create new message file' })
  @UseInterceptors(FileInterceptor('file'))
  createMessageFile(
    @Body() createMessageAttachmentDto: CreateMessageAttachmentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.messageService.createMessageFile(
      createMessageAttachmentDto,
      file,
    );
  }
}
