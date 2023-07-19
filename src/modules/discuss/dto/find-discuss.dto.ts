import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindDiscussDTO {
  @ApiProperty({ type: Number })
  skip: number;
  @ApiProperty({ type: Number })
  limit: number;
  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  sort?: 'asc' | 'desc';
  @ApiPropertyOptional({ type: String })
  topicId?: string;
}
