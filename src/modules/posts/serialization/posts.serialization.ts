import { ApiProperty } from '@nestjs/swagger';
import { IPosts } from '../interface';

export class PostsSerialization implements IPosts {
  @ApiProperty({ type: String })
  title: string;
  @ApiProperty({ type: String })
  content: string;
  @ApiProperty({ type: [String] })
  hashtag: string[];
  @ApiProperty({ type: Boolean })
  isDraft: boolean;
  @ApiProperty({ type: Number })
  totalView: number;
  @ApiProperty({ type: Number })
  status: number;
  @ApiProperty({ type: String })
  _id: string;
  @ApiProperty({ type: String })
  thumbnail: string;
  @ApiProperty({ type: String })
  thumbnailName: string;
  @ApiProperty({ type: String })
  createdAt: string;
  @ApiProperty({ type: String })
  updatedAt: string;
  @ApiProperty({ type: String })
  slug: string;
  @ApiProperty({ type: Number })
  __v: number;
}
