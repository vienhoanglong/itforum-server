import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HistoryNotification,
  HistoryNotificationDocument,
} from 'src/common/schemas/history-notification.schema';
import { CreateHistoryNotificationDto } from './dto';
import { HistoryNotificationGateway } from './history-notification.gateway';
@Injectable()
export class HistoryNotificationService {
  constructor(
    @InjectModel(HistoryNotification.name)
    private historyNotificationModel: Model<HistoryNotificationDocument>,
    private historyNotificationGateway: HistoryNotificationGateway,
  ) {}

  async createHistoryNotification(
    payload: CreateHistoryNotificationDto,
  ): Promise<HistoryNotification> {
    try {
      const createdNotification = new this.historyNotificationModel(payload);
      if (createdNotification) {
        this.historyNotificationGateway.handleNewHistoryNotification(
          createdNotification,
        );
      }
      return createdNotification.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getAllHistoryNotification() {
    try {
      return await this.historyNotificationModel.find().exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async markAsRead(notificationId: string, userId: string) {
    try {
      return await this.historyNotificationModel.findByIdAndUpdate(
        notificationId,
        {
          $addToSet: { readBy: userId },
        },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getNotificationsByUserId(
    userId: string,
  ): Promise<HistoryNotification[]> {
    return this.historyNotificationModel
      .find({
        $or: [
          { $and: [{ type: 'ALL' }, { sendTo: [] }] },
          { sendTo: { $in: [userId] } },
        ],
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}
