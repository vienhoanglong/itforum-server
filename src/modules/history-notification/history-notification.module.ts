import { DatabaseModule } from 'src/common/database/database.module';
import { HistoryNotificationController } from './history-notification.controller';
import { HistoryNotificationService } from './history-notification.service';
import { Module } from '@nestjs/common';
import { HistoryNotificationGateway } from './history-notification.gateway';

@Module({
  imports: [DatabaseModule],
  controllers: [HistoryNotificationController],
  providers: [HistoryNotificationService, HistoryNotificationGateway],
  exports: [HistoryNotificationService],
})
export class HistoryNotificationModule {}
