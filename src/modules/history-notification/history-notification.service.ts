import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HistoryNotification,
  HistoryNotificationDocument,
} from 'src/common/schemas/history-notification.schema';
import { CreateHistoryNotificationDto } from './dto';
@Injectable()
export class HistoryNotificationService {
  constructor(
    @InjectModel(HistoryNotification.name)
    private historyNotificationModel: Model<HistoryNotificationDocument>,
  ) {}

  async createHistoryNotification(
    payload: CreateHistoryNotificationDto,
  ): Promise<HistoryNotification> {
    const createdNotification = new this.historyNotificationModel(payload);
    return createdNotification.save();
  }
}
