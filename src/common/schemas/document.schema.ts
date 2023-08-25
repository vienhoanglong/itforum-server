import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type FilesDocument = Files & Document;
@Schema({ timestamps: true })
export class Files extends Document {
  @Prop()
  name: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: mongoose.Types.ObjectId;
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Topic' })
  topicId: mongoose.Types.ObjectId;
  @Prop({ type: Number, default: 0 })
  status: number;
  @Prop({ type: String })
  type: string;
  @Prop()
  file: string;
  @Prop()
  filename: string;
}

export const FilesSchema = SchemaFactory.createForClass(Files);
