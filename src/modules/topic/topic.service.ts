import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic, TopicDocument } from 'src/common/schemas/topic.schema';
import { CreateTopicDTO, UpdateTopicDTO } from './dto';
import { ITopic } from './interface';
@Injectable()
export class TopicService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
  ) {}
  async findAll(): Promise<ITopic[]> {
    return this.topicModel.find().exec();
  }

  async findOne(id: string): Promise<ITopic> {
    return this.topicModel.findById(id).exec();
  }

  async create(payload: CreateTopicDTO): Promise<ITopic> {
    const createdTopic = new this.topicModel(payload);
    return createdTopic.save();
  }

  async update(id: string, payload: UpdateTopicDTO): Promise<ITopic> {
    return this.topicModel.findByIdAndUpdate(id, payload, { new: true }).exec();
  }

  async remove(id: string): Promise<ITopic> {
    return this.topicModel.findByIdAndRemove(id).exec();
  }

  async hideTopic(id: string, hide: boolean): Promise<ITopic> {
    return this.topicModel
      .findByIdAndUpdate(id, { hide }, { new: true })
      .exec();
  }
}
