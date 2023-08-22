import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.schema';

export type DiscussDocument = Discuss & Document;
@Schema({ timestamps: { createdAt: 'createdAt' } })
export class Discuss extends Document {
  @Prop({ type: String, maxlength: 150 })
  title: string;
  @Prop()
  content: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createBy: User;
  @Prop({ type: Number, default: 0 })
  totalView: number;
  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Topic' }] })
  topic?: mongoose.Types.ObjectId[];
  @Prop()
  slug: string;
  @Prop({ type: Boolean, default: false, index: true })
  isDraft: boolean;
  @Prop({ type: Number, default: 0, index: true }) //0: Pending, 1: Approved, 2: Not Approved, 3: Hidden
  statusDiscuss: number;
}
export const DiscussSchema = SchemaFactory.createForClass(Discuss);

DiscussSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
