import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindReportDto {
  @ApiProperty({ type: Number })
  skip: number;
  @ApiProperty({ type: Number })
  limit: number;
  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  sort?: 'asc' | 'desc';
}
