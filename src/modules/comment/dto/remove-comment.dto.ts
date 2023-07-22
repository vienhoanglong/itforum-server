import { ApiProperty } from '@nestjs/swagger';

export class RemoveCommentDTO {
  @ApiProperty({ type: String })
  discussId: string;
  @ApiProperty({ type: String })
  commentId: string;
}
