import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePostsDto } from './create-posts.dto';

export class UpdatePostsDto extends PartialType(
  OmitType(CreatePostsDto, ['createdBy']),
) {
  thumbnailName: string;
}
