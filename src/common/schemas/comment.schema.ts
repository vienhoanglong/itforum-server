import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';

export type CommentDocument = Comment & Document;
@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Discuss' })
  discussId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' })
  postsId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createBy: User;

  @Prop({ type: String })
  content: string;

  @Prop({
    type: Number,
    default: 0,
  })
  left: number;

  @Prop({
    type: Number,
    default: 0,
  })
  right: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  commentParentId: Comment;

  @Prop({ type: Number, default: 0 })
  countChildComments: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
