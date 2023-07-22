import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import {
  CreateCommentDTO,
  QueryCommentDTO,
  RemoveCommentDTO,
  UpdateCommentDTO,
} from './dto';
import { CommentSerialization } from './serialization';

@ApiTags('Comments')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: CommentSerialization,
    description: 'Create comment success',
  })
  @ApiOperation({ summary: 'Create new comment' })
  createComment(@Body() createCommentDTO: CreateCommentDTO) {
    return this.commentService.createCommentDiscuss(createCommentDTO);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: [CommentSerialization],
    description: 'Get comment by parentId success',
  })
  @ApiOperation({ summary: 'Get comment parentId comment' })
  getCommentByParentId(@Query() queryCommentDTO: QueryCommentDTO) {
    return this.commentService.getCommentsByParentId(queryCommentDTO);
  }

  @Delete()
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'Delete comment by parentId success',
  })
  @ApiOperation({ summary: 'Delete comment parentId comment' })
  deleteComment(@Query() removeCommentDTO: RemoveCommentDTO) {
    return this.commentService.deleteComment(removeCommentDTO);
  }
  @ApiOperation({ summary: 'Update a comment by commentId' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CommentSerialization,
    description: 'The updated comment',
  })
  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDTO: UpdateCommentDTO,
  ) {
    const updatedComment = await this.commentService.updateComment(
      commentId,
      updateCommentDTO,
    );
    return updatedComment;
  }
}
