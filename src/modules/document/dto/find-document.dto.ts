import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindDocumentDto {
  @ApiProperty({ type: String })
  topicId: string;
  @ApiProperty({ type: Number })
  skip: number;
  @ApiProperty({ type: Number })
  limit: number;
  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  sort?: 'asc' | 'desc';
  @ApiPropertyOptional({ type: String })
  type?: string;
}
