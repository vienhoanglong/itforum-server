import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApproveReportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reportId: string;

  @ApiPropertyOptional()
  @IsOptional()
  reason?: string;
}
