import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic, TopicDocument } from 'src/common/schemas/topic.schema';
import { CreateTopicDTO, UpdateTopicDTO } from './dto';
@Injectable()
export class TopicService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
  ) {}
  async findAll(): Promise<Topic[]> {
    return await this.topicModel.find().exec();
  }

  async findOne(id: string): Promise<Topic> {
    return await this.topicModel.findById(id).exec();
  }

  async create(payload: CreateTopicDTO): Promise<Topic> {
    const createdTopic = new this.topicModel(payload);
    return await createdTopic.save();
  }

  async update(id: string, payload: UpdateTopicDTO): Promise<Topic> {
    return await this.topicModel
      .findByIdAndUpdate(id, payload, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Topic> {
    return await this.topicModel.findByIdAndRemove(id).exec();
  }

  async hideTopic(id: string, hide: boolean): Promise<Topic> {
    return await this.topicModel
      .findByIdAndUpdate(id, { hide }, { new: true })
      .exec();
  }

  async findTopicsByType(type: string): Promise<Topic[]> {
    const topics = await this.topicModel.find({ type }).exec();
    if (!topics || topics.length === 0) {
      throw new NotFoundException('No topics found for the specified type');
    }
    return topics;
  }

  async getListTopicByListId(listId: string): Promise<any> {
    const idList = listId.split(',').map((id) => id.trim());
    const topics = await this.topicModel
      .find({
        _id: { $in: idList },
      })
      .exec();
    if (topics.length < 0) {
      return [];
    }
    return topics;
  }
}
