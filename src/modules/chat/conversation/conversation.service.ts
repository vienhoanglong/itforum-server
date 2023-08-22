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
import { MessageService } from '../message/message.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    private userService: UserService,
    private messageService: MessageService,
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
    updatedBy: string,
  ): Promise<Conversation> {
    try {
      const conversation = await this.conversationModel.findByIdAndUpdate(
        id,
        updateConversationDto,
        { new: true },
      );
      if (conversation) {
        await this.messageService.createMessage({
          senderId: updatedBy,
          typeMessage: 'alert',
          contentMessage: 'The conversation was updated by',
          conversationId: id,
        });
      }
      return conversation;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async deleteConversation(id: string): Promise<boolean> {
    try {
      return await this.conversationModel.findByIdAndRemove(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getConversationById(id: string): Promise<Conversation> {
    try {
      return await this.conversationModel.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeMember(
    id: string,
    memberId: string,
    removedBy: string,
  ): Promise<Conversation> {
    try {
      const conversation = await this.conversationModel.findByIdAndUpdate(
        id,
        { $pull: { members: memberId } },
        { new: true },
      );
      if (conversation) {
        await this.messageService.createMessage({
          senderId: removedBy,
          typeMessage: 'alert',
          contentMessage: 'has been removed from the conversation by',
          conversationId: id,
        });
      }
      return conversation;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async addMember(
    id: string,
    memberId: string,
    addedBy: string,
  ): Promise<Conversation> {
    try {
      const conversation = await this.conversationModel.findByIdAndUpdate(
        id,
        { $push: { members: memberId } },
        { new: true },
      );
      if (conversation) {
        await this.messageService.createMessage({
          senderId: addedBy,
          typeMessage: 'alert',
          contentMessage: 'has been added from the conversation by',
          conversationId: id,
        });
      }
      return conversation;
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
