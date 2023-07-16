import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class HideTopicDTO {
  @ApiProperty({ type: 'string' })
  @IsString()
  id: string;
  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  hide: boolean;
}
