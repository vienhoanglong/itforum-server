import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsArray } from 'class-validator';

export class CreateHistoryNotificationDto {
  @ApiProperty({ example: 'Notification Title' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://example.com' })
  @IsNotEmpty()
  link: string;

  @ApiProperty({ enum: ['ALL', 'Some'], example: 'ALL' })
  @IsEnum(['ALL', 'Some'])
  type: string;

  @ApiProperty({ type: [String], example: ['user1', 'user2'] })
  @IsArray()
  sendTo: string[];

  @ApiProperty({ type: String })
  createdBy: string;
}
