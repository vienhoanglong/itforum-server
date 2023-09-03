import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type MessageDocument = Message & Document;
@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: String })
  contentMessage: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' })
  conversationId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  senderId?: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        typeEmotion: String,
      },
    ],
    default: [],
  })
  reactionMessage?: {
    userId: mongoose.Schema.Types.ObjectId;
    typeEmotion: string;
  }[];

  @Prop({ default: 'text' })
  typeMessage: string; //alert,file,image,link,chatgpt

  @Prop({ type: String })
  file?: string;

  @Prop({ type: String })
  nameFile?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
