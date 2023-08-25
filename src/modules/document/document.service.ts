import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Files, FilesDocument } from 'src/common/schemas/document.schema';
import { CreateFileDocumentDto } from './dto';
import { FirebaseService } from '../lib/firebase/firebase.service';
import { IDocumentFile } from './interface';
import { UserService } from '../user/user.service';
import { TopicService } from '../topic/topic.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Files.name) private filesModel: Model<FilesDocument>,
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
    private readonly topicService: TopicService,
  ) {}
  async createFileDocument(
    createFileDocumentDto: CreateFileDocumentDto,
    file: Express.Multer.File,
  ): Promise<Files> {
    try {
      const user = await this.userService.findById(
        createFileDocumentDto.createdBy,
      );
      if (!user) {
        throw new NotFoundException('Created by not be found');
      }
      if (user.role !== 0) {
        throw new UnauthorizedException('Role must be administrator');
      }
      const topic = await this.topicService.findOne(
        createFileDocumentDto.topicId,
      );
      if (!topic) {
        throw new NotFoundException('Topic found');
      }
      const payload: IDocumentFile = {
        ...createFileDocumentDto,
        name: '',
        file: '',
        type: '',
        filename: '',
      };
      if (file) {
        const data = await this.firebaseService.uploadFileIntoDocuments(file);
        payload.file = data?.link;
        payload.name = data?.filename;
        payload.type = data?.extension;
      }
      const newDocument = new this.filesModel(payload);
      return await newDocument.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getFileDocumentByTopic(topicId: string): Promise<Files[]> {
    try {
      return await this.filesModel.find({ topicId: topicId }).exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
