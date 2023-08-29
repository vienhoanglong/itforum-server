import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { CreateMessageAttachmentDto, CreateMessageDto } from './dto';
import { UploadedFile } from '@nestjs/common';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chatMessage')
  async handleChatMessage(@MessageBody() createMessageDto: CreateMessageDto) {
    try {
      const savedMessage = await this.messageService.createMessage(
        createMessageDto,
      );
      this.server.emit('newMessage', savedMessage);
      return savedMessage;
    } catch (error) {
      console.error('Error handling chat message:', error);
    }
  }
  @SubscribeMessage('createMessageFile')
  async handleCreateMessageFile(
    @MessageBody() createMessageAttachmentDto: CreateMessageAttachmentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const result = await this.messageService.createMessageFile(
        createMessageAttachmentDto,
        file,
      );
      this.server.emit('newMessageFile', result);
      return result;
    } catch (error) {
      console.error('Error handling chat message file:', error);
    }
  }
}
