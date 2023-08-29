import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class GetMessageDto {
  @ApiProperty({ type: String })
  @IsString()
  conversationId: string;
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  pageSize?: number;

  @ApiPropertyOptional({ type: Date })
  @IsDate()
  oldestMessageTimestamp?: Date;
}
