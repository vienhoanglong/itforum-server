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
      'DevOps',
      'Frameworks',
      'Languages',
      'Techniques',
      'Testing',
      'Tooling',
      'Subject',
    ],
    type: String,
  })
  type: string;
  @Prop()
  color: string;
  @Prop({
    default: false,
  })
  hide: boolean;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
