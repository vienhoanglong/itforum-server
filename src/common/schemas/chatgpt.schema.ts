import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChatGPTMessage extends Document {
  @Prop()
  message: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ChatGPTMessageSchema =
  SchemaFactory.createForClass(ChatGPTMessage);
