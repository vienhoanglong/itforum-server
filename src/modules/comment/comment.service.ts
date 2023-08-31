import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { PostsService } from '../posts/posts.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly discussService: DiscussService,
    private readonly utilService: UtilService,
    private readonly postsService: PostsService,
  ) {}
  async createCommentDiscuss(
    createCommentDTO: CreateCommentDTO,
  ): Promise<Comment> {
    try {
      const {
        discussId,
        createBy,
        content,
        commentParentId = null,
        postsId,
      } = createCommentDTO;
      if (discussId) {
        await this.validateDiscussExists(discussId);
        let rightValue = 0;
        if (commentParentId) {
          //reply comment
          const parentComment = await this.commentModel.findById(
            commentParentId,
          );
          if (!parentComment)
            throw new NotFoundException('Parent comment not found');
          rightValue = parentComment.right;
          // Update many comments
          await this.updateCommentsRightAndLeftDiscuss(
            discussId,
            rightValue,
            2,
          );
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
      if (postsId) {
        await this.validatePostsExists(postsId);
        let rightValue = 0;
        if (commentParentId) {
          //reply comment
          const parentComment = await this.commentModel.findById(
            commentParentId,
          );
          if (!parentComment)
            throw new NotFoundException('Parent comment not found');
          rightValue = parentComment.right;
          // Update many comments
          await this.updateCommentsRightAndLeftPosts(postsId, rightValue, 2);
        } else {
          const maxRightValue = await this.commentModel
            .findOne({ postsId: postsId }, 'right', {
              sort: { right: -1 },
            })
            .exec();
          rightValue = maxRightValue ? maxRightValue.right + 1 : 1;
        }
        const comment = new this.commentModel({
          postsId,
          createBy,
          content,
          commentParentId,
          left: rightValue,
          right: rightValue + 1,
        });
        await comment.save();
        return comment;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private async validateDiscussExists(discussId: string) {
    try {
      const foundDiscuss = await this.discussService.findByDiscussId(discussId);
      if (!foundDiscuss) throw new NotFoundException('Discuss not found');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  private async validatePostsExists(postsId: string) {
    try {
      const foundPosts = await this.postsService.findByPostsId(postsId);
      if (!foundPosts) throw new NotFoundException('Posts not found');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  private async updateCommentsRightAndLeftDiscuss(
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
  private async updateCommentsRightAndLeftPosts(
    postsId: string,
    rightValue: number,
    increment: number,
  ) {
    await this.commentModel.updateMany(
      { postsId, right: { $gte: rightValue } },
      { $inc: { right: increment } },
    );

    await this.commentModel.updateMany(
      { postsId, left: { $gt: rightValue } },
      { $inc: { left: increment } },
    );
  }
  async getCommentsByParentId(
    queryCommentDTO: QueryCommentDTO,
  ): Promise<Comment[]> {
    try {
      const {
        discussId,
        postsId,
        commentParentId,
        limit = 50,
        skip = 0,
      } = queryCommentDTO;
      if (discussId) {
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
        for (const comment of comments) {
          const childrenCount = await this.commentModel.countDocuments({
            discussId: this.utilService.convertToObjectId(discussId),
            commentParentId: comment._id,
          });
          comment.countChildComments = childrenCount;
        }
        return comments;
      }
      if (postsId) {
        const comments = await this.commentModel
          .find({
            postsId: this.utilService.convertToObjectId(postsId),
            commentParentId: commentParentId || null,
          })
          .sort({
            left: commentParentId ? 1 : -1,
          })
          .limit(limit)
          .skip(skip)
          .exec();

        if (!comments.length)
          throw new NotFoundException('Not found comment for posts');
        for (const comment of comments) {
          const childrenCount = await this.commentModel.countDocuments({
            postsId: this.utilService.convertToObjectId(postsId),
            commentParentId: comment._id,
          });
          comment.countChildComments = childrenCount;
        }
        return comments;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteComment(removeCommentDTO: RemoveCommentDTO): Promise<boolean> {
    try {
      const { discussId, commentId, postsId } = removeCommentDTO;
      const comment = await this.commentModel.findById(commentId).exec();
      if (!comment) throw new NotFoundException('Comment not found');
      const width = comment.right - comment.left + 1;
      const leftValue = comment.left;
      const rightValue = comment.right;
      if (discussId) {
        await this.commentModel.deleteMany({
          discussId: discussId,
          left: { $gte: leftValue, $lte: rightValue },
        });
        await this.commentModel.updateMany(
          {
            discussId: this.utilService.convertToObjectId(discussId),
            right: { $gt: rightValue },
          },
          { $inc: { right: -width } },
        );
        await this.commentModel.updateMany(
          {
            discussId: this.utilService.convertToObjectId(discussId),
            left: { $gt: leftValue },
          },
          { $inc: { left: -width } },
        );
        return true;
      }
      if (postsId) {
        await this.commentModel.deleteMany({
          postsId: this.utilService.convertToObjectId(postsId),
          left: { $gte: leftValue, $lte: rightValue },
        });
        await this.commentModel.updateMany(
          {
            postsId: this.utilService.convertToObjectId(postsId),
            right: { $gt: rightValue },
          },
          { $inc: { right: -width } },
        );
        await this.commentModel.updateMany(
          {
            postsId: this.utilService.convertToObjectId(postsId),
            left: { $gt: leftValue },
          },
          { $inc: { left: -width } },
        );
        return true;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateComment(
    commentId: string,
    updateCommentDTO: UpdateCommentDTO,
  ): Promise<Comment> {
    try {
      const comment = await this.commentModel.findById(commentId).exec();
      if (!comment) throw new NotFoundException('Comment not found');
      comment.content = updateCommentDTO.content;
      await comment.save();

      return comment;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
