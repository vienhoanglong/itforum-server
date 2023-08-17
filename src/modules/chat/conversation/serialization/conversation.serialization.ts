import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IConversation } from '../interface';

export class ConversationSerialization implements IConversation {
  @ApiProperty({ type: [String] })
  member: string[];
  @ApiPropertyOptional({ type: 'string' })
  createBy: string;
  nameConversation?: string;
  @ApiPropertyOptional({ type: 'string' })
  descConversation?: string;
  @ApiProperty({ type: 'string' })
  createdBy: string;
  @ApiPropertyOptional({ type: 'string' })
  imgConversation?: string;
}
