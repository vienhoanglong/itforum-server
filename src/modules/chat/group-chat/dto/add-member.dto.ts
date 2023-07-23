import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateGroupChatDTO } from './create-group-chat.dto';

export class AddMemberDTO extends PickType(CreateGroupChatDTO, ['member']) {
  @ApiProperty({ type: String })
  id: string;
}
