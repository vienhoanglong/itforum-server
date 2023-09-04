import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ReportDocument = Report & Document;

enum ReportType {
  Spam = 'Spam',
  Violence = 'Violence',
  CopyrightInfringement = 'Copyright infringement',
  Misinformation = 'Misinformation',
  Other = 'Other',
}

@Schema({ timestamps: true })
export class Report extends Document {
  @Prop({
    required: true,
    type: [String],
    enum: Object.values(ReportType),
  })
  typeReport: string[];

  @Prop({
    required: true,
    enum: ['Pending', 'Rejected', 'Approved'],
    default: 'Pending',
  })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: mongoose.Types.ObjectId;

  @Prop()
  otherText?: string; // Only present when typeReport is 'Other'

  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
  })
  idReference: mongoose.Types.ObjectId;

  @Prop({
    required: true,
  })
  link: string;

  @Prop({
    required: true,
    enum: ['Posts', 'Discuss'],
  })
  reportBelong: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
