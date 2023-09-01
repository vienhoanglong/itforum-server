import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import slugify from 'slugify';
export type PostsDocument = Posts & Document;
@Schema({ timestamps: true })
export class Posts extends Document {
  @Prop({ type: String, maxlength: 300 })
  title: string;

  @Prop()
  content: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  createdBy: mongoose.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Topic' }] })
  hashtag?: mongoose.Types.ObjectId[];

  @Prop()
  thumbnail?: string;

  @Prop()
  thumbnailName?: string;

  @Prop({ type: Boolean, default: false, index: true })
  isDraft: boolean;

  @Prop({ type: Number, default: 0 })
  totalView: number;

  @Prop({ type: Number, default: 0, index: true })
  status: number;

  @Prop()
  slug: string;

  @Prop()
  reasonBan?: string;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);

PostsSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
