import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from 'src/common/schemas/notification.schema';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';
import { FirebaseService } from '../lib/firebase/firebase.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private noticeModel: Model<NotificationDocument>,
    private readonly firebaseService: FirebaseService,
  ) {}
  async createNotification(
    createNotificationDto: CreateNotificationDto,
    file?: Express.Multer.File,
  ): Promise<Notification> {
    const newNotice = new this.noticeModel(createNotificationDto);
    if (file) {
      const data = await this.firebaseService.uploadFile(file);
      newNotice.file = data.link ?? undefined;
      newNotice.filename = data?.filename ?? undefined;
    }
    return await newNotice.save();
  }
  async findAllNotification(
    skip?: number,
    limit?: number,
    sort?: 'asc' | 'desc',
  ): Promise<Notification[]> {
    const sortField = 'createdAt';
    const sortOptions: any = {};
    sortOptions[sortField] = sort === 'asc' ? 1 : -1;
    const noticeList = await this.noticeModel
      .find()
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();
    return noticeList;
  }
  async findNotificationsByType(typeNotice: string): Promise<Notification[]> {
    const notices = await this.noticeModel
      .find({ typeNotice })
      .sort({ createdAt: -1 })
      .exec();
    if (!notices || notices.length === 0) {
      return [];
    }
    return notices;
  }
  async findNotificationsByLevel(level: string): Promise<Notification[]> {
    const notices = await this.noticeModel.find({ level }).exec();
    if (!notices || notices.length === 0) {
      return [];
    }
    return notices;
  }
  async updateNotification(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
    file?: Express.Multer.File,
  ): Promise<Notification> {
    if (file) {
      const data = await this.firebaseService.uploadFile(file);
      updateNotificationDto.file = data?.link ?? '';
      updateNotificationDto.filename = data?.filename ?? '';
    }
    const updateNotification = {
      ...updateNotificationDto,
    };
    Object.keys(updateNotification).forEach(
      (key) => updateNotification[key] === '' && delete updateNotification[key],
    );
    const response = await this.noticeModel.findByIdAndUpdate(
      id,
      updateNotification,
      { new: true },
    );
    return response;
  }
  async getNotificationOnTrash(isDeleted: boolean): Promise<Notification[]> {
    return await this.noticeModel.find({ isDeleted }).exec();
  }
  async removeTrashOrRestoreNotice(id: string): Promise<object> {
    const updatedNotification = await this.noticeModel
      .findById(id)
      .select('+isDeleted')
      .exec();
    if (!updatedNotification) {
      throw new NotFoundException('Notification not found');
    }

    updatedNotification.isDeleted = !updatedNotification.isDeleted;
    await updatedNotification.save();

    return {
      status: HttpStatus.OK,
      message: 'Successfully moved notification to trash or restore',
    };
  }
  async changePublishNotice(id: string): Promise<object> {
    const updatedNotification = await this.noticeModel
      .findById(id)
      .select('+isDeleted')
      .exec();
    if (!updatedNotification) {
      throw new NotFoundException('Notification not found');
    }

    updatedNotification.isPublished = !updatedNotification.isPublished;
    await updatedNotification.save();

    return {
      status: HttpStatus.OK,
      message: 'Successfully moved notification to trash or restore',
    };
  }
  async removeNotification(id: string): Promise<object> {
    const removedNotification = await this.noticeModel
      .findByIdAndDelete(id)
      .exec();
    if (!removedNotification) {
      throw new NotFoundException('Notification not found');
    }
    return {
      message: 'Remove notification successfully',
      data: true,
    };
  }
  async findByNotificationId(id: string): Promise<Notification> {
    try {
      return this.noticeModel.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async searchNotificationByTitle(
    titleNotice: string,
  ): Promise<Notification[]> {
    try {
      return await this.noticeModel
        .find({ titleNotice: { $regex: titleNotice, $options: 'i' } })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
