import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiPropertyOptional({ type: String, isArray: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  members?: string[];
  @ApiPropertyOptional({ type: String })
  nameConversation?: string;
  @ApiPropertyOptional({ type: String })
  descConversation?: string;
  @ApiProperty({ type: String })
  createdBy: string;
  @ApiPropertyOptional({ type: String })
  imgConversation?: string;
  @ApiPropertyOptional({ type: String })
  theme?: string;
}
