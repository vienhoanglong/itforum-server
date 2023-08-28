import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

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
}
