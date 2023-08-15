import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from 'src/common/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findByEmailNotPass(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  // async findAll(): Promise<UserDocument[]> {
  //   return this.userModel.find().exec();
  // }

  async findOne(payload: any): Promise<UserDocument> {
    return this.userModel.findOne(payload).exec();
  }

  async findOrCreateUser(userData: Partial<User>): Promise<User> {
    const user = await this.userModel.findOne({ email: userData.email }).exec();

    if (!user) {
      const createdUser = new this.userModel(userData);
      return createdUser.save();
    }
    return user;
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async resetPassword(id: string): Promise<string> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    const passwordReset = await this.hashData(
      user.username ?? (user.email.split('@')[0] || ''),
    );
    const userReset = await this.userModel.updateOne(
      { email: user.email },
      { password: passwordReset },
    );
    if (!userReset) throw new NotFoundException('Reset password failed');
    return `Reset password for user with id ${id} successfully`;
  }

  async addOtp(email: string, otp: string): Promise<string> {
    const user = await this.userModel.updateOne(
      { email },
      { otp, expiresOtp: new Date(Date.now() + 60000 * 5) },
    );
    if (!user) throw new NotFoundException('User not found');
    return 'Add OTP successfully';
  }

  async removeField(email: string, payload: any): Promise<boolean> {
    const user = await this.userModel.updateOne({ email }, { $unset: payload });
    if (!user) throw new NotFoundException('User not found');
    return true;
  }
  async findOneAndDelete(payload: any): Promise<UserDocument> {
    return this.userModel.findOneAndDelete(payload).exec();
  }
}
