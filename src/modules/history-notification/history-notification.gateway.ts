import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HistoryNotification } from 'src/common/schemas/history-notification.schema';
@WebSocketGateway()
export class HistoryNotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('newHistoryNotification')
  async handleNewHistoryNotification(@MessageBody() data: HistoryNotification) {
    try {
      this.server.emit('newHistoryNotification', data);
    } catch (error) {
      console.error('Error handling new history notification:', error);
    }
  }
}
