import { ApiProperty } from '@nestjs/swagger';
import { IComment } from '../interface';

export class CommentSerialization implements IComment {
  @ApiProperty({ type: 'string' })
  discussId: string;
  @ApiProperty({ type: 'string' })
  createBy: string;
  @ApiProperty({ type: 'string' })
  content: string;
  @ApiProperty({ type: 'number' })
  left: number;
  @ApiProperty({ type: 'number' })
  right: number;
  @ApiProperty({ type: 'string' })
  commentParentId: string;
}
