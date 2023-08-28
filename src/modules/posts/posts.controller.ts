import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreatePostsDto,
  FindPostsDTO,
  FindPostsOptionDto,
  UpdatePostsDto,
} from './dto';
import { PostsSerialization } from './serialization';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File/Image and Posts data',
    type: CreatePostsDto,
  })
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostsSerialization,
    description: 'Create notification success',
  })
  @ApiOperation({ summary: 'Create posts' })
  createNotification(
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() createPostsDto: CreatePostsDto,
  ) {
    return this.postsService.createPosts(createPostsDto, thumbnail);
  }

  @Get('slug/:slug')
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostsSerialization,
    description: 'Get posts by slug success',
  })
  @ApiOperation({ summary: 'Get posts by slug' })
  getPostsBySlug(@Param('slug') slug: string) {
    return this.postsService.getPostsBySlug(slug);
  }
  @Get('trash')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [PostsSerialization],
    description: 'Get posts from the trash success',
  })
  @ApiOperation({
    summary: 'Get posts from the trash with isDraft set to true',
  })
  getPostsOnTrash() {
    return this.postsService.getPostsOnTrash();
  }
  @Get('/posts-by-status')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object,
    description: 'Find posts by status or isDraft success',
  })
  @ApiOperation({ summary: 'Find posts by status or isDraft' })
  getPostsByStatusOrDraft(@Query() findPostsOptionDto: FindPostsOptionDto) {
    const { status, isDraft, limit, skip, sort, hashtag } = findPostsOptionDto;
    return this.postsService.getPostsByStatusOrDraft(
      status,
      isDraft,
      skip,
      limit,
      sort,
      hashtag,
    );
  }
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostsSerialization,
    description: 'Get posts by id success',
  })
  @ApiOperation({ summary: 'Get posts by postsId' })
  findDiscussById(@Param('id') id: string) {
    return this.postsService.findByPostsId(id);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object,
    description: 'Remove posts success',
  })
  @ApiOperation({ summary: 'Remove posts' })
  removeDiscuss(@Param('id') id: string) {
    return this.postsService.removePosts(id);
  }

  @Get(':id/increment-view')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object,
    description: 'Increment view success',
  })
  @ApiOperation({ summary: 'Increment view posts by postsId' })
  incrementTotalView(@Param('id') id: string) {
    return this.postsService.incrementTotalView(id);
  }
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostsSerialization,
    description: 'Get all posts success',
  })
  @ApiOperation({ summary: 'Get all posts' })
  getAllDiscuss(@Query() findPostsDTO: FindPostsDTO) {
    const discussList = this.postsService.findAllPosts(
      findPostsDTO.skip,
      findPostsDTO.limit,
      findPostsDTO.sort,
      findPostsDTO.hashtag,
    );
    return discussList;
  }
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File/Image and Posts Data',
    type: UpdatePostsDto,
  })
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiOperation({ summary: 'Update posts' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostsSerialization,
    description: 'Update posts success',
  })
  @ApiOperation({ summary: 'Update posts by postsId' })
  updatePosts(
    @Param('id') id: string,
    @Body() updatePostsDto: UpdatePostsDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    return this.postsService.updatePosts(id, updatePostsDto, thumbnail);
  }
  @Patch('change-status/:id/status/:status')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object,
    description: 'change status posts success',
  })
  @ApiOperation({ summary: 'Change status posts' })
  updateStatusPosts(@Param('id') id: string, @Param('status') status: number) {
    return this.postsService.updateStatusPosts(id, status);
  }
  @Patch('trash-or-restore/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object,
    description: 'Move to trash or restore posts success',
  })
  @ApiOperation({ summary: 'Move to trash or restore posts' })
  moveToTrashOrRestore(@Param('id') id: string) {
    return this.postsService.movePostsToTrashOrRestore(id);
  }
}
