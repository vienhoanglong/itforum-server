import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateConversationDto } from './index';

export class UpdateConversationDto extends PartialType(
  OmitType(CreateConversationDto, ['createdBy']),
) {}
