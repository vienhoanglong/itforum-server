import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type MessageDocument = Message & Document;
@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: String })
  contentMessage: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Conversation' })
  conversationId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  senderId?: mongoose.Types.ObjectId;

  @Prop({
    type: [
      {
        userId: { type: mongoose.Types.ObjectId, ref: 'User' },
        typeEmotion: String,
      },
    ],
    default: [],
  })
  reactionMessage?: { userId: mongoose.Types.ObjectId; typeEmotion: string }[];

  @Prop({ default: 'text' })
  typeMessage: string; //alert,file,image,link
}

export const MessageSchema = SchemaFactory.createForClass(Message);
