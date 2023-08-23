import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConversationService } from './conversation.service';
import { ConversationSerialization } from './serialization';
import {
  CreateConversationDto,
  UpdateConversationDto,
  UpdateImageConversationDto,
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Conversation')
@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}
  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConversationSerialization,
    description: 'Create conversation success',
  })
  @ApiOperation({ summary: 'Create new conversation' })
  createConversation(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.createConversation(createConversationDto);
  }
  @Patch(':id/:updatedBy')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConversationSerialization,
    description: 'Update conversation success',
  })
  @ApiOperation({ summary: 'Update conversation by conversationId' })
  updateConversation(
    @Param('id') id: string,
    @Param('updatedBy') updatedBy: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationService.updateConversation(
      id,
      updateConversationDto,
      updatedBy,
    );
  }
  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConversationSerialization,
    description: 'Delete conversation success',
  })
  @ApiOperation({ summary: 'Delete conversation by conversationId' })
  deleteConversation(@Param('id') id: string) {
    return this.conversationService.deleteConversation(id);
  }
  @Patch(':conversationId/remove-member/:memberId/:senderId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConversationSerialization,
    description: 'Remove member in conversation success',
  })
  @ApiOperation({ summary: 'Remove member in conversation' })
  removeMember(
    @Param('conversationId') conversationId: string,
    @Param('memberId') memberId: string,
    @Param('senderId') senderId: string,
  ) {
    return this.conversationService.removeMember(
      conversationId,
      memberId,
      senderId,
    );
  }

  @Patch(':conversationId/add-member/:memberId/:addedBy')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConversationSerialization,
    description: 'Add member in conversation success',
  })
  @ApiOperation({ summary: 'Add member in conversation' })
  addMember(
    @Param('conversationId') conversationId: string,
    @Param('memberId') memberId: string,
    @Param('addedBy') addedBy: string,
  ) {
    return this.conversationService.addMember(
      conversationId,
      memberId,
      addedBy,
    );
  }

  @Get('user/:userId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConversationSerialization,
    description: 'Get list conversation by userId success',
  })
  @ApiOperation({ summary: 'Add member in conversation' })
  getListConversationsByUser(@Param('userId') userId: string) {
    return this.conversationService.getListConversationByUser(userId);
  }

  @Post('update-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File/Image',
    type: UpdateImageConversationDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update image conversation' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConversationSerialization,
    description: 'Update image conversation success',
  })
  @ApiOperation({ summary: 'Update image conversation' })
  updateImageConversation(
    @Body() updateImageConversationDto: UpdateImageConversationDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.conversationService.updateImageConversation(
      updateImageConversationDto,
      file,
    );
  }
}
