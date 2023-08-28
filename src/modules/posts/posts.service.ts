import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts, PostsDocument } from 'src/common/schemas/posts';
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
      return this.postsModel.findById(id);
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
      const sortField = 'createdAt';
      const sortOptions: any = {};
      sortOptions[sortField] = sort === 'asc' ? 1 : -1;
      const query: { [x: string]: string | number | boolean } = {};
      query.status = Number(status);
      query.isDraft = isDraft ?? false;
      if (hashtag !== undefined) {
        query.topic = hashtag;
      }
      const postsList = await this.postsModel
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec();
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
      const sortField = 'createdAt';
      const sortOptions: any = {};
      sortOptions[sortField] = sort === 'asc' ? 1 : -1;

      const query = hashtag
        ? { topic: hashtag, isDraft: false }
        : { isDraft: false };
      const postsList = await this.postsModel
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec();
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
      hashtag: updatePostsDto.hashtag ? updatePostsDto.hashtag.split(',') : '',
    };
    Object.keys(updatePosts).forEach(
      (key) => updatePosts[key] === '' && delete updatePosts[key],
    );
    const response = await this.postsModel.findByIdAndUpdate(id, updatePosts, {
      new: true,
    });
    return response;
  }
}
