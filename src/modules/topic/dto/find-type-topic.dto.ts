import { ApiProperty } from '@nestjs/swagger';

export class FindTypeTopicDTO {
  @ApiProperty({
    enum: [
      'DevOps',
      'Frameworks',
      'Languages',
      'Techniques',
      'Testing',
      'Tooling',
      'Subject',
    ],
  })
  type: string;
}
