import { ApiProperty } from '@nestjs/swagger';
import { IDiscuss } from '../interface';

export class DiscussSerialization implements IDiscuss {
  @ApiProperty({ type: 'string' })
  title: string;
  @ApiProperty({ type: 'string' })
  content: string;
  @ApiProperty({ type: 'string' })
  createBy: string;
  @ApiProperty({ type: 'number' })
  totalView: number;
  @ApiProperty({ type: [String] })
  topic: string[];
  @ApiProperty({ type: 'string' })
  slug: string;
}
