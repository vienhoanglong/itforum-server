import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/common/schemas/message.schema';
import { CreateMessageDto } from './dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    try {
      const message = new this.messageModel(createMessageDto);
      return await message.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getAllMessagesInConversation(
    conversationId: string,
  ): Promise<Message[]> {
    try {
      return await this.messageModel.find({ conversationId }).exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
