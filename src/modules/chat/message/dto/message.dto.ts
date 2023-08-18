import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IReactionMessage } from '../interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class ReactionMessageDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  typeEmotion: string;
}
export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  contentMessage: string;

  @ApiProperty()
  @IsString()
  conversationId: string;

  @ApiProperty()
  @IsString()
  senderId: string;

  @ApiPropertyOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReactionMessageDto)
  reactionMessage?: IReactionMessage[];

  @ApiProperty()
  @IsString()
  typeMessage: string;
}
