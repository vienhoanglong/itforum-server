import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreatePostsDto {
  @ApiProperty({ type: String })
  title: string;
  @ApiProperty({ type: String })
  content: string;
  @ApiProperty({ type: String })
  createdBy: string;
  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @IsString({ each: true })
  hashtag: string;
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  thumbnail?: any;
}
