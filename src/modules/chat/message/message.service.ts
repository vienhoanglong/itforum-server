import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/common/schemas/message.schema';
import { CreateMessageAttachmentDto, CreateMessageDto } from './dto';
import { FirebaseService } from 'src/modules/lib/firebase/firebase.service';
import { IMessage } from './interface';
import { isImageFile } from 'src/constants/helper';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    private readonly firebaseService: FirebaseService,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    try {
      const message = new this.messageModel(createMessageDto);
      return await message.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getAllMessagesInConversation(
    conversationId: string,
  ): Promise<Message[]> {
    try {
      return await this.messageModel.find({ conversationId }).exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createMessageFile(
    createMessageAttachmentDto: CreateMessageAttachmentDto,
    file: Express.Multer.File,
  ): Promise<Message> {
    try {
      const payload: Partial<IMessage> = {
        ...createMessageAttachmentDto,
        reactionMessage: [],
        file: '',
        typeFile: '',
      };
      if (file) {
        const data = await this.firebaseService.uploadFileIntoMessages(file);
        console.log(data);
        payload.file = data?.link;
        payload.typeFile = data?.extension;
        payload.typeMessage = isImageFile(data.extension)
          ? 'image'
          : 'attachment';
      }
      const newMessage = new this.messageModel(payload);
      return await newMessage.save();
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
