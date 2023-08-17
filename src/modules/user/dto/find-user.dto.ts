import { ApiProperty } from '@nestjs/swagger';

export class FindUsersByListIdDto {
  @ApiProperty({ type: String })
  listId: string;
}
