import { Controller, Post, Body, HttpStatus, Get, Param } from '@nestjs/common';
import { HistoryNotificationService } from './history-notification.service';
import { CreateHistoryNotificationDto } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('History-notifications')
@Controller('history-notifications')
export class HistoryNotificationController {
  constructor(
    private readonly historyNotificationService: HistoryNotificationService,
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create history notification success',
  })
  @ApiOperation({ summary: 'Create history notification' })
  create(@Body() createNotificationDto: CreateHistoryNotificationDto) {
    return this.historyNotificationService.createHistoryNotification(
      createNotificationDto,
    );
  }
  @Get('user/:userId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all history notification of user by userId success',
  })
  @ApiOperation({ summary: 'Get all history notification of user by userId' })
  getNotificationsByUserId(@Param('userId') userId: string) {
    return this.historyNotificationService.getNotificationsByUserId(userId);
  }
  @Get(':id/mark-as-read/:userId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Mark as read history notification success',
  })
  @ApiOperation({ summary: 'Mark as read history notification' })
  markNotificationAsRead(
    @Param('id') notificationId: string,
    @Param('userId') userId: string,
  ) {
    return this.historyNotificationService.markAsRead(notificationId, userId);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'get all history notification success',
  })
  @ApiOperation({ summary: 'get all history notification' })
  getAllHistoryNotification() {
    return this.historyNotificationService.getAllHistoryNotification();
  }
}
