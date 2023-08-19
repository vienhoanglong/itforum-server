import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ type: String })
  titleNotice: string;
  @ApiProperty({ type: String })
  descNotice: string;
  @ApiPropertyOptional({ type: String })
  createdBy?: string;
  @ApiProperty({
    type: String,
    enum: ['recruitment', 'event', 'subject', 'other'],
  })
  typeNotice: 'recruitment' | 'event' | 'subject' | 'other';
  @ApiPropertyOptional({ type: 'string', format: 'binary' }) // Indicate that this property represents a file
  file?: any;
  @ApiPropertyOptional({ type: String, enum: ['normal', 'important'] }) // Specify the enum values
  level?: 'normal' | 'important';
}
