import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateGroupChatDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  userCreate: string;

  @ApiProperty()
  avatar: string;

  @ApiPropertyOptional()
  theme?: string;

  @ApiPropertyOptional({ type: String, isArray: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  adminChat?: string[];

  @ApiProperty({ type: String, isArray: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  member: string[];
}
