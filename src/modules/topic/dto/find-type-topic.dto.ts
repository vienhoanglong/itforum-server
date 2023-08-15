import { ApiProperty } from '@nestjs/swagger';

export class FindTypeTopicDTO {
  @ApiProperty({
    enum: [
      'devOps',
      'frameworks',
      'languages',
      'techniques',
      'testing',
      'tooling',
      'subject',
    ],
  })
  type: string;
}
