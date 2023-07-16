import { ApiProperty } from '@nestjs/swagger';
import { ITopic } from '../interface';

export class TopicSerialization implements ITopic {
  @ApiProperty({ type: 'string' })
  name: string;
  @ApiProperty({ type: 'string' })
  desc: string;
  @ApiProperty({ type: 'string' })
  type: string;
  @ApiProperty({ type: 'string' })
  color: string;
  @ApiProperty({ type: 'boolean' })
  hide?: boolean;
}
