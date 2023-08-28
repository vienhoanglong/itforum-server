import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class FindPostsDTO {
  @ApiProperty({ type: Number })
  skip: number;
  @ApiProperty({ type: Number })
  limit: number;
  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  sort?: 'asc' | 'desc';
  @ApiPropertyOptional({ type: String })
  hashtag?: string;
}

export class FindPostsOptionDto extends PartialType(FindPostsDTO) {
  @ApiPropertyOptional({ type: Number })
  status?: number;
  @ApiPropertyOptional({ type: Boolean })
  isDraft?: boolean;
}
