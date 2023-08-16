import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Notification extends Document {
  @Prop()
  titleNotice: string;

  @Prop()
  descNotice: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  createdBy: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ enum: [0, 1] }) //0: Admin notice for users, 1: Notification for discuss and articles posted
  typeNotice: number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
