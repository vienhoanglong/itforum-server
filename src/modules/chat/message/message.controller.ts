import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
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
import { CreateMessageAttachmentDto, CreateMessageDto } from './dto';
import { MessageSerialization } from './serialization';
import { FileInterceptor } from '@nestjs/platform-express';

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
  createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.createMessage(createMessageDto);
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
