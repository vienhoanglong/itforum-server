import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

enum ReportType {
  Spam = 'Spam',
  Violence = 'Violence',
  'Copyright infringement' = 'Copyright infringement',
  Misinformation = 'Misinformation',
  Other = 'Other',
}

enum ReportBelong {
  Posts = 'Posts',
  Discuss = 'Discuss',
}

export class CreateReportDto {
  @ApiProperty({
    isArray: true, // Specify that it's an array
    enum: ReportType,
  })
  @IsEnum(ReportType, { each: true }) // Validate each item in the array
  @IsNotEmpty()
  typeReport: string[];

  @ApiProperty({
    enum: ReportBelong,
  })
  @IsEnum(ReportBelong)
  @IsNotEmpty()
  reportBelong: string;

  @ApiProperty()
  @IsNotEmpty()
  idReference: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @ApiPropertyOptional()
  @IsOptional()
  otherText?: string;
}
