import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from 'src/common/schemas/comment.schema';
import { DiscussService } from '../discuss/discuss.service';
import { UtilService } from '../util/util.service';
import {
  CreateCommentDTO,
  QueryCommentDTO,
  RemoveCommentDTO,
  UpdateCommentDTO,
} from './dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly discussService: DiscussService,
    private readonly utilService: UtilService,
  ) {}
  async createCommentDiscuss(
    createCommentDTO: CreateCommentDTO,
  ): Promise<Comment> {
    const {
      discussId,
      createBy,
      content,
      commentParentId = null,
    } = createCommentDTO;
    //check discuss exists
    await this.validateDiscussExists(discussId);
    let rightValue = 0;
    if (commentParentId) {
      //reply comment
      const parentComment = await this.commentModel.findById(commentParentId);
      if (!parentComment)
        throw new NotFoundException('Parent comment not found');
      rightValue = parentComment.right;
      // Update many comments
      await this.updateCommentsRightAndLeft(discussId, rightValue, 2);
    } else {
      const maxRightValue = await this.commentModel
        .findOne({ discussId: discussId }, 'right', {
          sort: { right: -1 },
        })
        .exec();
      rightValue = maxRightValue ? maxRightValue.right + 1 : 1;
    }
    const comment = new this.commentModel({
      discussId,
      createBy,
      content,
      commentParentId,
      left: rightValue,
      right: rightValue + 1,
    });

    await comment.save();
    return comment;
  }

  private async validateDiscussExists(discussId: string) {
    const foundDiscuss = await this.discussService.findByDiscussId(discussId);
    if (!foundDiscuss) throw new NotFoundException('Discuss not found');
  }

  private async updateCommentsRightAndLeft(
    discussId: string,
    rightValue: number,
    increment: number,
  ) {
    await this.commentModel.updateMany(
      { discussId, right: { $gte: rightValue } },
      { $inc: { right: increment } },
    );

    await this.commentModel.updateMany(
      { discussId, left: { $gt: rightValue } },
      { $inc: { left: increment } },
    );
  }

  async getCommentsByParentId(
    queryCommentDTO: QueryCommentDTO,
  ): Promise<Comment[]> {
    const {
      discussId,
      commentParentId,
      limit = 50,
      skip = 0,
    } = queryCommentDTO;
    const comments = await this.commentModel
      .find({
        discussId: this.utilService.convertToObjectId(discussId),
        commentParentId: commentParentId || null,
      })
      .sort({
        left: commentParentId ? 1 : -1,
      })
      .limit(limit)
      .skip(skip)
      .exec();

    if (!comments.length)
      throw new NotFoundException('Not found comment for discuss');

    return comments;
  }

  async deleteComment(removeCommentDTO: RemoveCommentDTO): Promise<boolean> {
    const { discussId, commentId } = removeCommentDTO;
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) throw new NotFoundException('Comment not found');
    const width = comment.right - comment.left + 1;
    await this.commentModel.deleteMany({
      discussId: this.utilService.convertToObjectId(discussId),
      comment_left: { $gte: comment.left, $lte: comment.right },
    });
    await this.commentModel.updateMany(
      {
        discussId: this.utilService.convertToObjectId(discussId),
        right: { $gt: comment.right },
      },
      { $inc: { right: -width } },
    );
    await this.commentModel.updateMany(
      {
        discussId: this.utilService.convertToObjectId(discussId),
        left: { $gt: comment.left },
      },
      { $inc: { left: -width } },
    );
    return true;
  }

  async updateComment(
    commentId: string,
    updateCommentDTO: UpdateCommentDTO,
  ): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) throw new NotFoundException('Comment not found');
    comment.content = updateCommentDTO.content;
    await comment.save();

    return comment;
  }
}
