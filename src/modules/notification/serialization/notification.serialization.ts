import { ApiProperty } from '@nestjs/swagger';
import { INotification } from '../interface';

export class NotificationSerialization implements INotification {
  @ApiProperty({ type: 'string' })
  titleNotice: string;
  @ApiProperty({ type: 'string' })
  descNotice: string;
  @ApiProperty({ type: 'string' })
  createdBy: string;
  @ApiProperty({ type: 'string' })
  createdAt: string;
  @ApiProperty({ type: 'string' })
  typeNotice: string;
  @ApiProperty({ type: 'string' })
  level: string;
  @ApiProperty({ type: 'string' })
  _id: string;
  @ApiProperty({ type: 'string' })
  file: string;
}
