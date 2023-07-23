import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GroupChat,
  GroupChatDocument,
} from 'src/common/schemas/group-chat.schema';
import { AddMemberDTO, CreateGroupChatDTO, UpdateGroupChatDTO } from './dto';
import { UtilService } from 'src/modules/util/util.service';

@Injectable()
export class GroupChatService {
  constructor(
    @InjectModel(GroupChat.name)
    private groupChatModel: Model<GroupChatDocument>,
    private utilService: UtilService,
  ) {}

  async createGroupChat(
    createGroupChatDTO: CreateGroupChatDTO,
  ): Promise<GroupChat> {
    const createdGroupChat = new this.groupChatModel(createGroupChatDTO);
    return createdGroupChat.save();
  }

  async getGroupChatByID(groupChatId: string): Promise<GroupChat> {
    const groupChat = await this.groupChatModel.findById(groupChatId);
    if (!groupChat) {
      throw new NotFoundException('Group chat not found');
    }
    return groupChat;
  }

  async updateGroupChat(
    groupChatId: string,
    updateGroupChatDTO: UpdateGroupChatDTO,
  ): Promise<GroupChat> {
    const updatedGroupChat = await this.groupChatModel.findByIdAndUpdate(
      groupChatId,
      updateGroupChatDTO,
      { new: true },
    );
    if (!updatedGroupChat) {
      throw new NotFoundException('Group chat not found');
    }
    return updatedGroupChat;
  }

  async deleteGroupChatByID(groupChatId: string): Promise<GroupChat> {
    const deletedGroupChat = await this.groupChatModel.findByIdAndDelete(
      groupChatId,
    );
    if (!deletedGroupChat) {
      throw new NotFoundException('Group chat not found');
    }
    return deletedGroupChat;
  }

  async addMembersToGroupChat(addMemberDTO: AddMemberDTO): Promise<GroupChat> {
    const { member, id } = addMemberDTO;
    const groupChat = await this.groupChatModel.findById(
      this.utilService.convertToObjectId(id),
    );
    if (!groupChat) {
      throw new NotFoundException('Group chat not found');
    }

    const newMembers = member.map((memberId) =>
      this.utilService.convertToObjectId(memberId),
    );
    const existingMembers = groupChat.member.map((members) =>
      members.toString(),
    );

    // Check if any of the members already exist in the group chat's members
    for (const newMember of newMembers) {
      if (existingMembers.includes(newMember.toString())) {
        throw new Error(
          `Member ${newMember.toString()} already exists in the group chat`,
        );
      }
      groupChat.member.push(newMember);
    }

    return groupChat.save();
  }

  async removeMemberFromGroupChat(
    groupChatId: string,
    memberId: string,
  ): Promise<GroupChat> {
    const groupChat = await this.groupChatModel.findById(
      this.utilService.convertToObjectId(groupChatId),
    );
    if (!groupChat) {
      throw new NotFoundException('Group chat not found');
    }

    // Check if the member ID exists in the group chat's members
    const memberIndex = groupChat.member.indexOf(
      this.utilService.convertToObjectId(memberId),
    );
    if (memberIndex === -1) {
      throw new NotFoundException('Member not found in the group chat');
    }

    groupChat.member.splice(memberIndex, 1); // Remove the member from the members array
    return groupChat.save();
  }
}
