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
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTopicDTO, HideTopicDTO, UpdateTopicDTO } from './dto';
import { ITopic } from './interface';
import { TopicSerialization } from './serialization';
@ApiTags('Topic')
@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: [TopicSerialization],
    description: 'Get list topic success',
  })
  @ApiOperation({ summary: 'Get list topic' })
  findAll(): Promise<ITopic[]> {
    return this.topicService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: TopicSerialization,
    description: 'Get topic by topicId success',
  })
  @ApiOperation({ summary: 'Get topic by topicId' })
  findOne(@Param('id') id: string) {
    return this.topicService.findOne(id);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: TopicSerialization,
    description: 'Create topic success',
  })
  @ApiOperation({ summary: 'Create new topic' })
  create(@Body() createTopicDTO: CreateTopicDTO) {
    return this.topicService.create(createTopicDTO);
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
