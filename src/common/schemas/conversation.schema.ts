import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;
@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }] })
  members?: mongoose.Types.ObjectId[];
  @Prop({ type: String })
  nameConversation?: string;
  @Prop({ type: String })
  descConversation?: string;
  @Prop({ type: String })
  createdBy: string;
  @Prop({ type: String })
  imgConversation?: string;
  @Prop({ type: String })
  theme?: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
