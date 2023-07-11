import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNumber,
  IsIn,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    type: String,
    required: [true, 'Required'],
    maxlength: [50, 'Must be 50 characters or less'],
    unique: true,
    validate: [IsEmail, 'Please enter a valid email'],
  })
  @IsString()
  @MaxLength(50, { message: 'Must be 50 characters or less' })
  email: string;
  @Prop({
    type: String,
    required: [true, 'Required'],
    minlength: [6, 'Must be at least 6 characters'],
    maxlength: [20, 'Must be less than 20 characters'],
    unique: true,
  })
  @IsString()
  @MinLength(6, { message: 'Must be at least 6 characters' })
  @MaxLength(20, { message: 'Must be less than 20 characters' })
  username: string;
  @Prop({
    type: String,
    required: [true, 'Required'],
    select: false,
    minlength: [8, 'Must be 8 characters or more'],
  })
  @IsString()
  @MinLength(8, { message: 'Must be 8 characters or more' })
  password: string;

  @IsString()
  fullName: string;
  @IsNumber()
  @IsIn([0, 1, 2, 3])
  role: number;
  // Admin: 0, Teacher: 1, Student: 2, Company: 3
  @Prop({
    type: String,
    default:
      'https://preview.redd.it/rrz3hmsxcll71.png?width=640&crop=smart&auto=webp&s=87cc5ed38d8f088ef9fffef7a4c5756b64309d6a',
  })
  @IsString()
  avatar: string;

  @Prop({
    type: String,
    default: "I'm a student",
  })
  @IsString()
  desc: string;

  @Prop({
    type: String,
    default: 'Nam',
  })
  @IsString()
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
  @IsBoolean()
  ban: boolean;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
