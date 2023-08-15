import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
export class LinksDto {
  @ApiProperty({ type: 'string' })
  id: string;
  @ApiProperty({ type: 'string' })
  name: string;
  @ApiProperty({ type: 'string' })
  link: string;
}
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  birthDay?: Date;
  @ApiPropertyOptional()
  class?: string;
  @ApiPropertyOptional()
  major?: string;
  @ApiPropertyOptional({ type: String, isArray: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  skill?: string[];
  @ApiPropertyOptional({ type: [LinksDto] })
  @ValidateNested()
  @Type(() => LinksDto)
  links?: LinksDto[];
  @ApiPropertyOptional()
  address?: string;
  @ApiPropertyOptional()
  coverImg?: string;
}
