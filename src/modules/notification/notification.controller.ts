import {
  BadRequestException,
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
import { RedisCacheService } from '../lib/redis-cache/redis-cache.service';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

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
  async createNotification(
    @UploadedFile() file: Express.Multer.File,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    try {
      const response = await this.notificationService.createNotification(
        createNotificationDto,
        file,
      );
      await this.redisCacheService.set(
        `notification:${response._id}`,
        JSON.stringify(response),
        864000,
      );
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('trash')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [NotificationSerialization],
    description: 'Get notification from the trash success',
  })
  @ApiOperation({
    summary: 'Get notification from the trash with isDeleted set to true',
  })
  async getNotificationOnTrash(@Query('isDeleted') isDeleted: boolean) {
    return this.notificationService.getNotificationOnTrash(isDeleted);
  }

  @Get('search')
  @ApiOperation({ summary: 'search notification by title' })
  searchByUsername(@Query('titleNotice') titleNotice: string) {
    return this.notificationService.searchNotificationByTitle(titleNotice);
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
  @ApiOperation({ summary: 'Update notification' })
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
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: NotificationSerialization,
    description: 'Get notification by id success',
  })
  @ApiOperation({ summary: 'Get notification by discussId' })
  async findDiscussById(@Param('id') id: string) {
    try {
      const cacheData = await this.redisCacheService.get(`notification:${id}`);
      if (cacheData) {
        return JSON.parse(cacheData);
      }
      const response = await this.notificationService.findByNotificationId(id);
      await this.redisCacheService.set(
        `notification:${response._id}`,
        JSON.stringify(response),
        864000,
      );
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
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
