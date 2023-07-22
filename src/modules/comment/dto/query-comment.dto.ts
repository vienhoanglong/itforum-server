import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCommentDTO {
  @ApiProperty({ type: String })
  discussId: string;
  @ApiPropertyOptional({ type: Number })
  skip?: number;
  @ApiPropertyOptional({ type: Number })
  limit?: number;
  @ApiPropertyOptional({ type: String })
  commentParentId?: string | null;
}
