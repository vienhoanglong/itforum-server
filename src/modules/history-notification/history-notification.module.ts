import { DatabaseModule } from 'src/common/database/database.module';
import { HistoryNotificationController } from './history-notification.controller';
import { HistoryNotificationService } from './history-notification.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [HistoryNotificationController],
  providers: [HistoryNotificationService],
})
export class HistoryNotificationModule {}
