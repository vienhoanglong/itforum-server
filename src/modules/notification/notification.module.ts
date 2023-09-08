import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { FirebaseModule } from '../lib/firebase/firebase.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { HistoryNotificationModule } from '../history-notification/history-notification.module';
import { RedisCacheModule } from '../lib/redis-cache/redis-cache.module';

@Module({
  imports: [
    DatabaseModule,
    FirebaseModule,
    HistoryNotificationModule,
    RedisCacheModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
