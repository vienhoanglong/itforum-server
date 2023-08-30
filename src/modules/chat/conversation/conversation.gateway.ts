import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConversationService } from './conversation.service';
import { Server, Socket } from 'socket.io';
import { UpdateConversationDto, UpdateImageConversationDto } from './dto';
import { UploadedFile } from '@nestjs/common';
@WebSocketGateway()
export class ConversationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly conversationService: ConversationService) {}
  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('updateConversation')
  async handleUpdateConversation(
    @MessageBody() id: string,
    @MessageBody() updateConversationDto: UpdateConversationDto,
    @MessageBody() updatedBy: string,
  ) {
    try {
      const updatedConversation = this.conversationService.updateConversation(
        id,
        updateConversationDto,
        updatedBy,
      );
      this.server.emit('conversationUpdated', updatedConversation);
      return updatedConversation;
    } catch (error) {
      console.error('Error handling update conversation:', error);
    }
  }
  @SubscribeMessage('updateConversationImage')
  async handleUpdateConversationImage(
    @MessageBody() updateImageConversationDto: UpdateImageConversationDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const result = this.conversationService.updateImageConversation(
        updateImageConversationDto,
        file,
      );
      this.server.emit('conversationUpdatedImage', result);
      return result;
    } catch (error) {
      console.error('Error handling update image conversation:', error);
    }
  }
}
