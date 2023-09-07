import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Discuss, DiscussDocument } from 'src/common/schemas/discuss.schema';
import { CreateDiscussDTO, UpdateDiscussDTO } from './dto';
import slugify from 'slugify';

@Injectable()
export class DiscussService {
  constructor(
    @InjectModel(Discuss.name) private discussModel: Model<DiscussDocument>,
  ) {}

  async createDiscuss(createDiscussDTO: CreateDiscussDTO): Promise<Discuss> {
    try {
      const newDiscuss = new this.discussModel(createDiscussDTO);
      return await newDiscuss.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateDiscuss(
    id: string,
    updateDiscussDTO: UpdateDiscussDTO,
  ): Promise<Discuss> {
    try {
      if (updateDiscussDTO.title) {
        updateDiscussDTO.slug = slugify(updateDiscussDTO.title, {
          lower: true,
        });
      }
      const updatedDiscuss = await this.discussModel.findByIdAndUpdate(
        id,
        updateDiscussDTO,
        { new: true },
      );
      return updatedDiscuss;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllDiscuss(
    skip?: number,
    limit?: number,
    sort?: 'asc' | 'desc',
    topicId?: string,
  ): Promise<Discuss[]> {
    try {
      const skipNumber = typeof skip === 'number' ? skip : 0;
      const sortField = 'createdAt';
      const sortOptions: any = {};
      sortOptions[sortField] = sort === 'asc' ? 1 : -1;

      const query = topicId
        ? { topic: topicId, isDraft: false }
        : { isDraft: false };
      const pipeline: any[] = [
        {
          $match: query,
        },
        {
          $sort: sortOptions,
        },
        {
          $skip: skipNumber,
        },
        {
          $lookup: {
            from: 'comments',
            let: { discussId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$$discussId', '$discussId'] },
                },
              },
            ],
            as: 'totalComment',
          },
        },
        {
          $addFields: {
            totalComment: { $size: '$totalComment' },
          },
        },
      ];
      if (limit && limit > 0) {
        pipeline.push({
          $limit: limit,
        });
      }
      const discussList = await this.discussModel.aggregate(pipeline);

      return discussList;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async moveDiscussToTrashOrRestore(id: string): Promise<object> {
    try {
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
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findByDiscussId(id: string): Promise<Discuss> {
    try {
      const pipeline = [
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: 'comments',
            let: { discussId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$$discussId', '$discussId'] },
                },
              },
            ],
            as: 'totalComment',
          },
        },
        {
          $addFields: {
            totalComment: { $size: '$totalComment' },
          },
        },
      ];

      const discuss = await this.discussModel.aggregate(pipeline);

      if (discuss.length === 0) {
        throw new NotFoundException('Discuss not found');
      }

      return discuss[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeDiscuss(id: string): Promise<string> {
    try {
      const removedDiscuss = await this.discussModel
        .findByIdAndDelete(id)
        .exec();
      if (!removedDiscuss) {
        throw new NotFoundException('Discuss not found');
      }
      return 'Remove discuss successfully';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async incrementTotalView(id: string): Promise<number> {
    try {
      const updatedDiscuss = await this.discussModel
        .findByIdAndUpdate(id, { $inc: { totalView: 1 } }, { new: true })
        .exec();
      if (!updatedDiscuss) {
        throw new NotFoundException('Discuss not found');
      }
      return updatedDiscuss.totalView;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getDiscussBySlug(slug: string): Promise<Discuss> {
    try {
      const discuss = await this.discussModel
        .findOne({ slug, isDraft: true }) //only get draft equal true
        .exec();
      if (!discuss) {
        throw new NotFoundException('Discuss not found');
      }
      return discuss;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getDiscussesOnTrash(): Promise<Discuss[]> {
    try {
      return await this.discussModel.find({ isDraft: true }).exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateStatusDiscuss(
    id: string,
    statusDiscuss: number,
  ): Promise<Discuss> {
    try {
      return await this.discussModel
        .findByIdAndUpdate(id, { statusDiscuss }, { new: true })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getDiscussByStatusOrDraft(
    statusDiscuss: number,
    isDraft: boolean,
    skip?: number,
    limit?: number,
    sort?: 'asc' | 'desc',
    topicId?: string,
  ): Promise<Discuss[]> {
    try {
      const skipNumber = typeof skip === 'number' ? skip : 0;
      const sortField = 'createdAt';
      const sortOptions: any = {};
      sortOptions[sortField] = sort === 'asc' ? 1 : -1;
      const query: { [x: string]: string | number | boolean } = {};
      if (statusDiscuss) {
        query.statusDiscuss = Number(statusDiscuss);
      }
      query.isDraft = isDraft ?? false;
      if (topicId !== undefined) {
        query.topic = topicId;
      }
      const pipeline: any[] = [
        {
          $match: query,
        },
        {
          $sort: sortOptions,
        },
        {
          $skip: skipNumber,
        },
        {
          $lookup: {
            from: 'comments',
            let: { discussId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$$discussId', '$discussId'] },
                },
              },
            ],
            as: 'totalComment',
          },
        },
        {
          $addFields: {
            totalComment: { $size: '$totalComment' },
          },
        },
      ];
      if (limit && limit > 0) {
        pipeline.push({
          $limit: limit,
        });
      }
      const discussList = await this.discussModel.aggregate(pipeline);

      return discussList;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async updateDiscussReport(
    id: string,
    statusDiscuss: number,
    reasonBan?: string,
  ): Promise<Discuss> {
    try {
      return await this.discussModel
        .findByIdAndUpdate(
          id,
          { statusDiscuss, reasonBan: reasonBan ?? '' },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async countDocumentDiscuss(start: any, end: any): Promise<number> {
    try {
      return await this.discussModel
        .countDocuments({
          createdAt: {
            $gte: start.toDate(),
            $lte: end.toDate(),
          },
        })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getTopTopic(): Promise<any> {
    try {
      return await this.discussModel.aggregate([
        {
          $unwind: '$topic',
        },
        {
          $group: {
            _id: '$topic',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 3,
        },
      ]);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
