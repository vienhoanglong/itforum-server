import { PickType } from '@nestjs/swagger';
import { CreateGroupChatDTO } from './create-group-chat.dto';

export class UpdateGroupChatDTO extends PickType(CreateGroupChatDTO, [
  'name',
  'theme',
  'avatar',
]) {}
