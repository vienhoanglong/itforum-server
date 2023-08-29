import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TopicDocument = Topic & Document;
@Schema({ timestamps: true })
export class Topic extends Document {
  @Prop()
  name: string;
  @Prop()
  desc: string;
  @Prop({
    enum: [
      'devOps',
      'frameworks',
      'languages',
      'techniques',
      'testing',
      'tooling',
      'subject',
    ],
    type: String,
  })
  type: string;
  @Prop()
  color: string;
  @Prop({
    default: false,
  })
  @Prop()
  hide: boolean;
  @Prop()
  img: string;
  @Prop({ type: Boolean, default: false, index: true })
  isDraft: boolean;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
