import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
export type NotificationDocument = Notification & Document;
@Schema()
export class Notification extends Document {
  @Prop()
  titleNotice: string;

  @Prop()
  descNotice: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  createdBy?: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({
    enum: ['recruitment', 'event', 'subject', 'other'],
    type: String,
    default: 'other',
  })
  typeNotice: string;

  @Prop()
  file?: string;

  @Prop({ default: 'normal' })
  level?: string;

  @Prop({ default: true })
  isPublished?: boolean;

  @Prop({ default: false })
  isDeleted?: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
