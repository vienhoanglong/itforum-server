import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type GroupChatDocument = GroupChat & Document;
@Schema({ timestamps: true })
export class GroupChat extends Document {
  @Prop({ required: true, default: ' ' })
  name: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  userCreate: mongoose.Types.ObjectId;

  @Prop({ default: null })
  avatar: string;

  @Prop({ default: null })
  theme: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }] })
  adminChat: mongoose.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }] })
  member: mongoose.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Message' }] })
  message: mongoose.Types.ObjectId[];
}

export const GroupChatSchema = SchemaFactory.createForClass(GroupChat);
