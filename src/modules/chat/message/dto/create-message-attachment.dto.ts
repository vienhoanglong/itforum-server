import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMessageDto } from './message.dto';

export class CreateMessageAttachmentDto extends PartialType(CreateMessageDto) {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
  nameFile: string;
}
