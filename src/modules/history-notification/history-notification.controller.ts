import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
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
}
