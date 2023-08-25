import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDocumentDto {
  @ApiProperty({ type: 'string' })
  createdBy: string;
  @ApiProperty({ type: 'string' })
  topicId: string;
  @ApiProperty({ type: 'number' })
  status: number;
  @ApiProperty({ type: 'string', format: 'binary' }) // Indicate that this property represents a file
  file?: any;
}
