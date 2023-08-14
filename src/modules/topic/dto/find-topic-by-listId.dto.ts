import { ApiProperty } from '@nestjs/swagger';

export class FindTopicsByListIdDto {
  @ApiProperty({ type: String })
  listId: string;
}
