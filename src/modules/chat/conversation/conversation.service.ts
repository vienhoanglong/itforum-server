import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from 'src/common/schemas/conversation.schema';
import { CreateConversationDto, UpdateConversationDto } from './dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  async createConversation(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    try {
      const conversation = new this.conversationModel(createConversationDto);
      return conversation.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateConversation(
    id: string,
    updateConversationDto: UpdateConversationDto,
  ): Promise<Conversation> {
    try {
      return this.conversationModel.findByIdAndUpdate(
        id,
        updateConversationDto,
        { new: true },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async deleteConversation(id: string): Promise<boolean> {
    try {
      return this.conversationModel.findByIdAndRemove(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getConversationById(id: string): Promise<Conversation> {
    try {
      return this.conversationModel.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeMember(id: string, memberId: string): Promise<Conversation> {
    try {
      return this.conversationModel.findByIdAndUpdate(
        id,
        { $pull: { members: memberId } },
        { new: true },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async addMember(id: string, memberId: string): Promise<Conversation> {
    try {
      return this.conversationModel.findByIdAndUpdate(
        id,
        { $push: { members: memberId } },
        { new: true },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getListConversationByUser(userId: string): Promise<Conversation[]> {
    try {
      return this.conversationModel.find({ members: userId }).exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
