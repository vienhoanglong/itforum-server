import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpStatus,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupChatService } from './group-chat.service';
import { AddMemberDTO, CreateGroupChatDTO, UpdateGroupChatDTO } from './dto';

@ApiTags('GroupChat')
@Controller('group-chat')
export class GroupChatController {
  constructor(private readonly groupChatService: GroupChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create new group chat' })
  addGroupChat(@Body() createGroupChatDTO: CreateGroupChatDTO) {
    return this.groupChatService.createGroupChat(createGroupChatDTO);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Group chat ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get group-chat by id success',
  })
  @ApiOperation({ summary: 'Get group-chat by id' })
  getGroupChatByID(@Param('id') id: string) {
    return this.groupChatService.getGroupChatByID(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'Group chat ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update group-chat by id success',
  })
  @ApiOperation({ summary: 'Update group-chat by id' })
  updateGroupChat(
    @Param('id') id: string,
    @Body() updateGroupChatDTO: UpdateGroupChatDTO,
  ) {
    return this.groupChatService.updateGroupChat(id, updateGroupChatDTO);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Group chat ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete group-chat by id success',
  })
  @ApiOperation({ summary: 'Delete group-chat by id' })
  deleteGroupChatByID(@Param('id') id: string) {
    return this.groupChatService.deleteGroupChatByID(id);
  }

  @Post('add-member')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Add member success',
  })
  @ApiOperation({ summary: 'Add member into group-chat' })
  addMemberToGroupChat(@Body() addMemberDTO: AddMemberDTO) {
    return this.groupChatService.addMembersToGroupChat(addMemberDTO);
  }

  @Delete(':id/remove-member/:memberId')
  @ApiParam({ name: 'id', description: 'Group chat ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID to be removed' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Add member success',
  })
  @ApiOperation({ summary: 'Remove member into group-chat' })
  removeMemberFromGroupChat(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    return this.groupChatService.removeMemberFromGroupChat(id, memberId);
  }
}
