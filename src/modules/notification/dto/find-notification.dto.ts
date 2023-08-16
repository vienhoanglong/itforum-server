import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindNotificationDTO {
  @ApiProperty({ type: Number })
  skip: number;
  @ApiProperty({ type: Number })
  limit: number;
  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  sort?: 'asc' | 'desc';
}

export class FindTypeNotificationDTO {
  @ApiProperty({
    enum: ['recruitment', 'event', 'subject', 'other'],
  })
  typeNotice: string;
}

export class FindLevelNotificationDTO {
  @ApiProperty({
    enum: ['normal', 'important'],
  })
  level: string;
}
