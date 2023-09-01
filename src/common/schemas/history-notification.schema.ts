import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type HistoryNotificationDocument = HistoryNotification & Document;
@Schema({ timestamps: true })
export class HistoryNotification extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  link: string;

  @Prop({ enum: ['ALL', 'Some'], default: 'ALL' })
  type: string;

  @Prop({ type: [{ type: String, ref: 'User' }] })
  sendTo: mongoose.Types.ObjectId[];
}

export const HistoryNotificationSchema =
  SchemaFactory.createForClass(HistoryNotification);
