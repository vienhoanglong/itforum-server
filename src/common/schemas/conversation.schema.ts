import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;
@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ type: [String] })
  members: string[];
  @Prop({ type: String })
  nameConversation?: string;
  @Prop({ type: String })
  descConversation?: string;
  @Prop({ type: String })
  createdBy: string;
  @Prop({ type: String })
  imgConversation?: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
