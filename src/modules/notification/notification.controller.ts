import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { NotificationService } from './notification.service';
import {
  CreateNotificationDto,
  FindLevelNotificationDTO,
  FindNotificationDTO,
  FindTypeNotificationDTO,
  UpdateNotificationDto,
} from './dto';
import { NotificationSerialization } from './serialization';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File/Image and Notification Data',
    type: CreateNotificationDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: HttpStatus.OK,
    type: NotificationSerialization,
    description: 'Create notification success',
  })
  @ApiOperation({ summary: 'Create notification' })
  createNotification(
    @UploadedFile() file: Express.Multer.File,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationService.createNotification(
      createNotificationDto,
      file,
    );
  }

  @Get('trash')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [NotificationSerialization],
    description: 'Get notification from the trash success',
  })
  @ApiOperation({
    summary: 'Get notification from the trash with isDeteled set to true',
  })
  async getNotificationOnTrash(@Query('isDeleted') isDeteled: boolean) {
    return this.notificationService.getNotificationOnTrash(isDeteled);
  }

  @Get('/find-by-type')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [NotificationSerialization],
    description: 'Find notification by type success',
  })
  @ApiOperation({ summary: 'Find notification by type' })
  findTopicsByType(@Query() findTypeNotificationDTO: FindTypeNotificationDTO) {
    return this.notificationService.findNotificationsByType(
      findTypeNotificationDTO.typeNotice,
    );
  }

  @Get('/find-by-level')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [NotificationSerialization],
    description: 'Find notification by level success',
  })
  @ApiOperation({ summary: 'Find notification by level' })
  findTopicsByLevel(
    @Query() findLevelNotificationDTO: FindLevelNotificationDTO,
  ) {
    return this.notificationService.findNotificationsByLevel(
      findLevelNotificationDTO.level,
    );
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File/Image and Notification Data',
    type: UpdateNotificationDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create notification' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: NotificationSerialization,
    description: 'Update notification success',
  })
  @ApiOperation({ summary: 'Update notification by noticeId' })
  updateDiscuss(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.notificationService.updateNotification(
      id,
      updateNotificationDto,
      file,
    );
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: [NotificationSerialization],
    description: 'Get all notification success',
  })
  @ApiOperation({ summary: 'Get all notification' })
  getAllDiscuss(@Query() findNotificationDTO: FindNotificationDTO) {
    const { skip, limit, sort } = findNotificationDTO;
    const noticeList = this.notificationService.findAllNotification(
      skip,
      limit,
      sort,
    );
    return noticeList;
  }

  @Patch('trash-or-restore/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object,
    description: 'Move to trash or restore notification success',
  })
  @ApiOperation({ summary: 'Move to trash or restore notification' })
  removeTrashOrRestoreNotice(@Param('id') id: string) {
    return this.notificationService.removeTrashOrRestoreNotice(id);
  }
  @Patch('change-publish/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object,
    description: 'Change publish notification success',
  })
  @ApiOperation({ summary: 'Change publish notification' })
  changePublishNotice(@Param('id') id: string) {
    return this.notificationService.changePublishNotice(id);
  }
  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object,
    description: 'Remove notification success',
  })
  @ApiOperation({ summary: 'Remove discuss' })
  removeNotification(@Param('id') id: string) {
    return this.notificationService.removeNotification(id);
  }
}
