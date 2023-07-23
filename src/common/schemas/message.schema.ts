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
  @Prop({ type: mongoose.Types.ObjectId, index: true, ref: 'GroupChat' })
  idChat: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  authorID: mongoose.Types.ObjectId;

  @Prop()
  title: string;

  @Prop({
    id: { type: mongoose.Types.ObjectId, ref: 'Message' },
    title: String,
    file: FileSchema,
  })
  replyMessage: {
    id: mongoose.Types.ObjectId;
    title: string;
    file: FileDocument;
  };

  @Prop({
    type: [
      { id: { type: mongoose.Types.ObjectId, ref: 'User' }, seenAt: String },
    ],
  })
  seen: { id: mongoose.Types.ObjectId; seenAt: string }[];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }] })
  tagName: mongoose.Types.ObjectId[];

  @Prop({
    type: [
      {
        idUser: { type: mongoose.Types.ObjectId, ref: 'User' },
        type_emotion: String,
      },
    ],
  })
  reactionMess: { idUser: mongoose.Types.ObjectId; type_emotion: string }[];

  @Prop({ default: 'text' })
  type_mess: string;

  @Prop({ type: [FileSchema] })
  file: FileDocument[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
