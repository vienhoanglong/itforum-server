import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Files, FilesDocument } from 'src/common/schemas/document.schema';
import { CreateFileDocumentDto, FindDocumentDto } from './dto';
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
  async deleteDocument(id: string): Promise<boolean> {
    try {
      const document = this.filesModel.findByIdAndDelete(id).exec();
      if (!document) {
        return false;
      }
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllByTopicIdAndType(
    findDocumentDto: FindDocumentDto,
  ): Promise<Files[]> {
    try {
      const { topicId, type, limit, skip, sort } = findDocumentDto;
      const sortField = 'createdAt';
      const sortOptions: any = {};
      sortOptions[sortField] = sort === 'asc' ? 1 : -1;
      const query = type ? { topicId, type } : { topicId };
      const documents = await this.filesModel
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec();

      return documents;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
