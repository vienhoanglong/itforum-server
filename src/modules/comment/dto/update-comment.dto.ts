import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDTO {
  @ApiProperty({ type: String })
  content: string;
}
