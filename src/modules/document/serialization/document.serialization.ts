import { ApiProperty } from '@nestjs/swagger';
import { IDocumentFile } from '../interface';

export class DocumentSerialization implements IDocumentFile {
  @ApiProperty({ type: 'string' })
  name: string;
  @ApiProperty({ type: 'string' })
  file: string;
  @ApiProperty({ type: 'string' })
  type: string;
  @ApiProperty({ type: 'string' })
  filename: string;
  @ApiProperty({ type: 'number' })
  status: number;
  @ApiProperty({ type: 'string' })
  topicId: string;
  @ApiProperty({ type: 'string' })
  createdBy: string;
}
