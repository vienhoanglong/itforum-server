import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDTO {
  @ApiPropertyOptional({ type: String })
  discussId?: string;
  @ApiPropertyOptional({ type: String })
  postsId?: string;
  @ApiProperty({ type: String })
  createBy: string;
  @ApiProperty({ type: String })
  content: string;
  @ApiProperty({ type: String })
  commentParentId?: string;
}
