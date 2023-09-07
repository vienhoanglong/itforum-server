import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Posts, PostsDocument } from 'src/common/schemas/posts.schema';
import { CreatePostsDto, UpdatePostsDto } from './dto';
import { FirebaseService } from '../lib/firebase/firebase.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postsModel: Model<PostsDocument>,
    private readonly firebaseService: FirebaseService,
  ) {}

  async createPosts(
    createPostsDto: CreatePostsDto,
    file: Express.Multer.File,
  ): Promise<Posts> {
    try {
      const payload = {
        ...createPostsDto,
        createdBy: createPostsDto.createdBy,
        hashtag: createPostsDto.hashtag.split(','),
      };
      const newPosts = new this.postsModel(payload);
      if (file) {
        const data = await this.firebaseService.uploadFileToStorage(
          file,
          'posts/',
        );
        newPosts.thumbnail = data?.link;
        newPosts.thumbnailName = data.filename;
      }
      return await newPosts.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findByPostsId(id: string): Promise<Posts> {
    try {
      const pipeline = [
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: 'comments',
            let: { postsId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$$postsId', '$postsId'] },
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

      const posts = await this.postsModel.aggregate(pipeline);

      if (posts.length === 0) {
        throw new NotFoundException('Posts not found');
      }

      return posts[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async removePosts(id: string): Promise<string> {
    try {
      const removedPosts = await this.postsModel.findByIdAndDelete(id).exec();
      if (!removedPosts) {
        throw new NotFoundException('Posts not found');
      }
      return 'Remove posts successfully';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async incrementTotalView(id: string): Promise<{ totalView: number }> {
    try {
      const updatedPosts = await this.postsModel
        .findByIdAndUpdate(id, { $inc: { totalView: 1 } }, { new: true })
        .exec();
      if (!updatedPosts) {
        throw new NotFoundException('Posts not found');
      }
      return { totalView: updatedPosts.totalView };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getPostsBySlug(slug: string): Promise<Posts> {
    try {
      const posts = await this.postsModel
        .findOne({ slug, isDraft: false })
        .exec();
      if (!posts) {
        throw new NotFoundException('Posts not found');
      }
      return posts;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getPostsOnTrash(): Promise<Posts[]> {
    try {
      return await this.postsModel.find({ isDraft: true }).exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async updateStatusPosts(id: string, status: number): Promise<Posts> {
    try {
      return await this.postsModel
        .findByIdAndUpdate(id, { status }, { new: true })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getPostsByStatusOrDraft(
    status: number,
    isDraft: boolean,
    skip?: number,
    limit?: number,
    sort?: 'asc' | 'desc',
    hashtag?: string,
  ): Promise<Posts[]> {
    try {
      const skipNumber = typeof skip === 'number' ? skip : 0;
      const sortField = 'createdAt';
      const sortOptions: any = {};
      sortOptions[sortField] = sort === 'asc' ? 1 : -1;

      const query: { [x: string]: any } = {};
      if (status) {
        query.status = Number(status);
      }
      query.isDraft = isDraft ?? false;
      if (hashtag) {
        query.hashtag = { $in: [hashtag] };
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
            let: { postsId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$$postsId', '$postsId'] },
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
      const postsList = await this.postsModel.aggregate(pipeline);
      return postsList;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async movePostsToTrashOrRestore(id: string): Promise<object> {
    try {
      const updatedPosts = await this.postsModel
        .findById(id)
        .select('+isDraft')
        .exec();
      if (!updatedPosts) {
        throw new NotFoundException('Posts not found');
      }

      updatedPosts.isDraft = !updatedPosts.isDraft;
      await updatedPosts.save();

      return {
        status: HttpStatus.OK,
        message: 'Successfully moved posts to trash or restore',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findAllPosts(
    skip?: number,
    limit?: number,
    sort?: 'asc' | 'desc',
    hashtag?: string,
  ): Promise<Posts[]> {
    try {
      const skipNumber = typeof skip === 'number' ? skip : 0;
      const sortField = 'createdAt';
      const sortOptions: any = {};
      sortOptions[sortField] = sort === 'asc' ? 1 : -1;

      const query = hashtag
        ? { hashtag: hashtag, isDraft: false }
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
            let: { postsId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$$postsId', '$postsId'] },
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
      const postsList = await this.postsModel.aggregate(pipeline);

      return postsList;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async updatePosts(
    id: string,
    updatePostsDto: UpdatePostsDto,
    thumbnail?: Express.Multer.File,
  ): Promise<Posts | any> {
    try {
      if (thumbnail) {
        const data = await this.firebaseService.uploadFileToStorage(
          thumbnail,
          'posts/',
        );
        updatePostsDto.thumbnail = data?.link ?? '';
        updatePostsDto.thumbnailName = data?.filename ?? '';
      }
      const updatePosts = {
        ...updatePostsDto,
        hashtag: updatePostsDto.hashtag
          ? updatePostsDto.hashtag.split(',')
          : '',
      };
      Object.keys(updatePosts).forEach(
        (key) => updatePosts[key] === '' && delete updatePosts[key],
      );
      const response = await this.postsModel.findByIdAndUpdate(
        id,
        updatePosts,
        {
          new: true,
        },
      );
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async searchPostsByTitle(title: string): Promise<Posts[]> {
    try {
      return await this.postsModel
        .find({ title: { $regex: title, $options: 'i' } })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updatePostsReport(
    id: string,
    status: number,
    reasonBan?: string,
  ): Promise<Posts> {
    try {
      return await this.postsModel
        .findByIdAndUpdate(
          id,
          { status, reasonBan: reasonBan ?? '' },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async countDocumentPosts(start: any, end: any): Promise<number> {
    try {
      return await this.postsModel
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

  async getTopHashTag(): Promise<any> {
    try {
      return await this.postsModel.aggregate([
        {
          $unwind: '$hashtag',
        },
        {
          $group: {
            _id: '$hashtag',
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
