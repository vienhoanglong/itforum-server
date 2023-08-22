import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';

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

export class FindDiscussOptionDto extends PartialType(
  OmitType(FindDiscussDTO, ['topicId']),
) {
  @ApiPropertyOptional({ type: Number })
  statusDiscuss?: number;
  @ApiPropertyOptional({ type: Boolean })
  isDraft?: boolean;
}
