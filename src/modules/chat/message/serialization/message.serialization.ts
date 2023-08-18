import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IMessage, IReactionMessage } from '../interface';

export class MessageSerialization implements IMessage {
  @ApiProperty({ type: 'string' })
  contentMessage: string;
  @ApiProperty({ type: 'string' })
  conversationId: string;
  @ApiProperty({ type: 'string' })
  senderId: string;
  @ApiPropertyOptional()
  reactionMessage?: IReactionMessage[];
  @ApiProperty({ type: 'string' })
  typeMessage: string;
}
