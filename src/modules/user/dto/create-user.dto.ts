import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MinLength,
  MaxLength,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  refreshToken?: string;
}
