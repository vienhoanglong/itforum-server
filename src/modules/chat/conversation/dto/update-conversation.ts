import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateConversationDto } from './index';

export class UpdateConversationDto extends PartialType(
  OmitType(CreateConversationDto, ['createdBy']),
) {}

export class UpdateImageConversationDto {
  @ApiProperty({ type: String })
  conversationId: string;
  @ApiProperty({ type: String })
  updatedBy: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  file?: any;
}
