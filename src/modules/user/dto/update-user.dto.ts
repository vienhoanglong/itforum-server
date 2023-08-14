import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
export class ContactDto {
  @ApiProperty({ type: 'string' })
  name: string;
  @ApiProperty({ type: 'string' })
  link: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  birthDay?: string;
  @ApiPropertyOptional()
  class?: string;
  @ApiPropertyOptional()
  major?: string;
  @ApiPropertyOptional({ type: String, isArray: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  skill?: string[];
  @ApiPropertyOptional({ type: [ContactDto] })
  @ValidateNested()
  @Type(() => ContactDto)
  contact?: ContactDto[];
}
