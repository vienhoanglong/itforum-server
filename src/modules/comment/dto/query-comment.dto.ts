import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCommentDTO {
  @ApiPropertyOptional({ type: String })
  discussId?: string;
  @ApiPropertyOptional({ type: String })
  postsId?: string;
  @ApiPropertyOptional({ type: Number })
  skip?: number;
  @ApiPropertyOptional({ type: Number })
  limit?: number;
  @ApiPropertyOptional({ type: String })
  commentParentId?: string | null;
}
