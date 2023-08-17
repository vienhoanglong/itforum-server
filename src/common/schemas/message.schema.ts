import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class File {
  @Prop()
  url: string;

  @Prop()
  title: string;

  @Prop({ default: 1 })
  status: number;

  @Prop()
  fileType: string;
}

export type FileDocument = File & Document;
export const FileSchema = SchemaFactory.createForClass(File);

export type CommentDocument = Comment & Document;
@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: String })
  contentMessage: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Conversation' })
  conversationId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  senderId: mongoose.Types.ObjectId;

  @Prop({
    type: [
      {
        userId: { type: mongoose.Types.ObjectId, ref: 'User' },
        typeEmotion: String,
      },
    ],
  })
  reactionMessage: { userId: mongoose.Types.ObjectId; typeEmotion: string }[];

  @Prop({ default: 'text' })
  typeMessage: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
