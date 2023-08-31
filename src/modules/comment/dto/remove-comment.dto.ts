import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RemoveCommentDTO {
  @ApiPropertyOptional({ type: String })
  discussId?: string;
  @ApiPropertyOptional({ type: String })
  postsId?: string;
  @ApiProperty({ type: String })
  commentId: string;
}
