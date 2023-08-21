import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from 'src/common/schemas/conversation.schema';
import { CreateConversationDto, UpdateConversationDto } from './dto';
import { UserService } from 'src/modules/user/user.service';
import { getCommaSeparatedNames } from 'src/constants/helper';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    private userService: UserService,
  ) {}

  async createConversation(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation | any> {
    try {
      if (!createConversationDto.nameConversation) {
        const users = [];
        const response = await this.userService.getListUserByListId(
          createConversationDto.members.toString(),
        );
        response &&
          response.map((user) => {
            users.push({
              username: user.username,
              fullName: user.fullName,
              email: user.email,
            });
          });
        createConversationDto.nameConversation =
          getCommaSeparatedNames(users) ?? '';
      }
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
