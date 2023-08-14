import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;
  @Prop({
    type: String,
    unique: true,
  })
  username: string;
  @Prop({
    type: String,
    select: false,
    minlength: [8, 'Must be 8 characters or more'],
  })
  password: string;

  @Prop()
  googleId?: string;

  @Prop()
  fullName?: string;

  @Prop({ type: Number })
  role: number;
  // Admin: 0, Teacher: 1, Student: 2, Company: 3
  @Prop({
    type: String,
    default:
      'https://preview.redd.it/rrz3hmsxcll71.png?width=640&crop=smart&auto=webp&s=87cc5ed38d8f088ef9fffef7a4c5756b64309d6a',
  })
  avatar: string;

  @Prop({
    type: String,
    default: "I'm a student",
  })
  desc: string;

  @Prop({
    type: String,
    default: '',
  })
  gender: string;

  @Prop({
    type: [String],
    default: [],
  })
  followers: string[];

  @Prop({
    type: Boolean,
    default: false,
  })
  ban: boolean;

  @Prop()
  phoneNumber?: string;

  @Prop()
  birthDay?: Date;

  @Prop()
  class?: string;

  @Prop()
  major?: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Topic' }] })
  skill?: mongoose.Types.ObjectId[];

  @Prop()
  refreshToken?: string;

  @Prop({
    type: String,
    default: 'white',
  })
  color: string;

  @Prop()
  links?: object[];

  @Prop()
  address?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
