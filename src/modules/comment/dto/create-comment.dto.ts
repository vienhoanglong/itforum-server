import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDTO {
  @ApiProperty({ type: String })
  discussId: string;
  @ApiProperty({ type: String })
  createBy: string;
  @ApiProperty({ type: String })
  content: string;
  @ApiProperty({ type: String })
  commentParentId?: string;
}
