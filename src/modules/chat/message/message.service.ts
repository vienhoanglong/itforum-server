import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/common/schemas/message.schema';
import { CreateMessageAttachmentDto, CreateMessageDto } from './dto';
import { FirebaseService } from 'src/modules/lib/firebase/firebase.service';
import { IMessage } from './interface';
import { isImageFile, urlLogoChatGpt } from 'src/constants/helper';
import { ChatGPTService } from 'src/modules/chatgpt/chatgpt.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    private readonly firebaseService: FirebaseService,
    private readonly chatGPTService: ChatGPTService,
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
        nameFile: '',
      };
      if (file) {
        const data = await this.firebaseService.uploadFileIntoMessages(file);
        console.log(data);
        payload.file = data?.link;
        payload.nameFile = data?.filename;
        payload.typeMessage = isImageFile(data.extension) ? 'image' : 'file';
      }
      const newMessage = new this.messageModel(payload);
      return await newMessage.save();
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async createMessageChatGpt(
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    try {
      const message = new this.messageModel(createMessageDto);
      const response = await message.save();
      const data = await this.chatGPTService.sendMessage(
        createMessageDto.contentMessage,
      );
      if (data) {
        const payload: Partial<IMessage> = {
          ...createMessageDto,
          contentMessage: '',
          typeMessage: '',
          file: '',
        };
        payload.contentMessage = data;
        payload.typeMessage = 'chatgpt';
        payload.file = urlLogoChatGpt;
        const messageChatgpt = new this.messageModel(payload);
        await messageChatgpt.save();
      }
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
