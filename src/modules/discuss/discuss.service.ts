import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discuss, DiscussDocument } from 'src/common/schemas/discuss.schema';
import { CreateDiscussDTO, UpdateDiscussDTO } from './dto';
import slugify from 'slugify';

@Injectable()
export class DiscussService {
  constructor(
    @InjectModel(Discuss.name) private discussModel: Model<DiscussDocument>,
  ) {}

  async createDiscuss(createDiscussDTO: CreateDiscussDTO): Promise<Discuss> {
    const newDiscuss = new this.discussModel(createDiscussDTO);
    return await newDiscuss.save();
  }

  async updateDiscuss(
    id: string,
    updateDiscussDTO: UpdateDiscussDTO,
  ): Promise<Discuss> {
    if (updateDiscussDTO.title) {
      updateDiscussDTO.slug = slugify(updateDiscussDTO.title, { lower: true });
    }
    const updatedDiscuss = await this.discussModel.findByIdAndUpdate(
      id,
      updateDiscussDTO,
      { new: true },
    );
    return updatedDiscuss;
  }

  async findAllDiscuss(
    skip?: number,
    limit?: number,
    sort?: 'asc' | 'desc',
    topicId?: string,
  ): Promise<Discuss[]> {
    const sortField = 'createdAt';
    const sortOptions: any = {};
    sortOptions[sortField] = sort === 'asc' ? 1 : -1;

    const query = topicId ? { topic: topicId } : {};
    const discussList = await this.discussModel
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();
    return discussList;
  }

  async moveDiscussToTrashOrRestore(id: string): Promise<object> {
    const updatedDiscuss = await this.discussModel
      .findById(id)
      .select('+isDraft')
      .exec();
    if (!updatedDiscuss) {
      throw new NotFoundException('Discuss not found');
    }

    updatedDiscuss.isDraft = !updatedDiscuss.isDraft;
    await updatedDiscuss.save();

    return {
      status: HttpStatus.OK,
      message: 'Successfully moved discuss to trash or restore',
    };
  }

  async findByDiscussId(id: string): Promise<Discuss> {
    return this.discussModel.findById(id);
  }

  async removeDiscuss(id: string): Promise<string> {
    const removedDiscuss = await this.discussModel.findByIdAndDelete(id).exec();
    if (!removedDiscuss) {
      throw new NotFoundException('Discuss not found');
    }
    return 'Remove discuss successfully';
  }
}
