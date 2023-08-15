import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTopicDTO {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  desc: string;
  @ApiProperty()
  @IsString()
  type: string;
  @ApiProperty()
  @IsString()
  color: string;
  @ApiProperty()
  @IsString()
  img: string;
}
