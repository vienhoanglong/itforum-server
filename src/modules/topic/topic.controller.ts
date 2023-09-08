import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
  Query,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateTopicDTO,
  FindTopicsByListIdDto,
  FindTypeTopicDTO,
  HideTopicDTO,
  UpdateTopicDTO,
} from './dto';
import { TopicSerialization } from './serialization';
import { RedisCacheService } from '../lib/redis-cache/redis-cache.service';
@ApiTags('Topic')
@Controller('topic')
export class TopicController {
  constructor(
    private readonly topicService: TopicService,
    private readonly redisCacheService: RedisCacheService,
  ) {}
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: [TopicSerialization],
    description: 'Get list topic success',
  })
  @ApiOperation({ summary: 'Get list topic' })
  findAll() {
    return this.topicService.findAll();
  }

  @Patch('trash-or-restore')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object,
    description: 'Move to trash or restore topic success',
  })
  @ApiOperation({ summary: 'Move to trash or restore topic' })
  moveToTrashOrRestore(@Query('id') id: string) {
    return this.topicService.moveTopicToTrashOrRestore(id);
  }

  @Get('trash')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [TopicSerialization],
    description: 'Get topics from the trash success',
  })
  @ApiOperation({
    summary: 'Get topics from the trash with isDraft set to false',
  })
  async getTopicOnTrash() {
    return this.topicService.getTopicOnTrash();
  }
  @Get('/list-topic')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [TopicSerialization],
    description: 'Get list topic by list topicId success',
  })
  @ApiOperation({ summary: 'Get list topic by list topicId' })
  getListTopicByListId(@Query() findTopicsByListIdDto: FindTopicsByListIdDto) {
    return this.topicService.getListTopicByListId(findTopicsByListIdDto.listId);
  }
  @Get('/find-by-type')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [TopicSerialization],
    description: 'Find topics by type success',
  })
  @ApiOperation({ summary: 'Find topics by type' })
  findTopicsByType(@Query() findTypeTopicDTO: FindTypeTopicDTO) {
    return this.topicService.findTopicsByType(findTypeTopicDTO.type);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: TopicSerialization,
    description: 'Get topic by topicId success',
  })
  @ApiOperation({ summary: 'Get topic by topicId' })
  async findOne(@Param('id') id: string) {
    try {
      const cacheData = await this.redisCacheService.get(`topic:${id}`);
      if (cacheData) {
        return JSON.parse(cacheData);
      }
      const response = await this.topicService.findOne(id);
      await this.redisCacheService.set(
        `topic:${response._id}`,
        JSON.stringify(response),
        864000,
      );
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: TopicSerialization,
    description: 'Create topic success',
  })
  @ApiOperation({ summary: 'Create new topic' })
  async create(@Body() createTopicDTO: CreateTopicDTO) {
    try {
      const response = await this.topicService.create(createTopicDTO);
      await this.redisCacheService.set(
        `topic:${response._id}`,
        JSON.stringify(response),
        864000,
      );
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Put(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: TopicSerialization,
    description: 'Update topic success',
  })
  @ApiOperation({ summary: 'Update topic by topicId' })
  update(@Param('id') id: string, @Body() updateTopicDTO: UpdateTopicDTO) {
    return this.topicService.update(id, updateTopicDTO);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: TopicSerialization,
    description: 'Remove topic success',
  })
  @ApiOperation({ summary: 'Remove topic by topicId' })
  remove(@Param('id') id: string) {
    return this.topicService.remove(id);
  }

  @Patch()
  @ApiResponse({
    status: HttpStatus.OK,
    type: TopicSerialization,
    description: 'Hide topic success',
  })
  @ApiOperation({ summary: 'Hide topic by topicId' })
  toggleTopic(@Query() queryTopic: HideTopicDTO) {
    return this.topicService.hideTopic(queryTopic.id, queryTopic.hide);
  }
}
