import {
  Post,
  Body,
  HttpStatus,
  Controller,
  Param,
  Patch,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { DiscussService } from './discuss.service';
import {
  CreateDiscussDTO,
  FindDiscussDTO,
  FindDiscussOptionDto,
  UpdateDiscussDTO,
} from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DiscussSerialization } from './serialization';
@ApiTags('Discuss')
@Controller('discuss')
export class DiscussController {
  constructor(private readonly discussService: DiscussService) {}

  @Get('slug/:slug')
  @ApiResponse({
    status: HttpStatus.OK,
    type: DiscussSerialization,
    description: 'Get discuss by slug success',
  })
  @ApiOperation({ summary: 'Get discuss by slug' })
  getDiscussionBySlug(@Param('slug') slug: string) {
    return this.discussService.getDiscussBySlug(slug);
  }

  @Get('trash')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [DiscussSerialization],
    description: 'Get discusses from the trash success',
  })
  @ApiOperation({
    summary: 'Get discusses from the trash with isDraft set to false',
  })
  async getDiscussesOnTrash() {
    return this.discussService.getDiscussesOnTrash();
  }

  @Get('/discussions-by-status')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object,
    description: 'Find discuss by status or isDraft success',
  })
  @ApiOperation({ summary: 'Find discuss by status or isDraft' })
  getDiscussByStatusOrIsDraft(
    @Query() findDiscussOptionDTO: FindDiscussOptionDto,
  ) {
    const { statusDiscuss, isDraft, limit, skip, sort, topicId } =
      findDiscussOptionDTO;
    return this.discussService.getDiscussByStatusOrDraft(
      statusDiscuss,
      isDraft,
      skip,
      limit,
      sort,
      topicId,
    );
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: DiscussSerialization,
    description: 'Get discuss by id success',
  })
  @ApiOperation({ summary: 'Get discuss by discussId' })
  findDiscussById(@Param('id') id: string) {
    return this.discussService.findByDiscussId(id);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: DiscussSerialization,
    description: 'Create discuss success',
  })
  @ApiOperation({ summary: 'Create new discuss' })
  createDiscuss(@Body() createDiscussDTO: CreateDiscussDTO) {
    return this.discussService.createDiscuss(createDiscussDTO);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: DiscussSerialization,
    description: 'Update discuss success',
  })
  @ApiOperation({ summary: 'Update discuss by discussId' })
  updateDiscuss(
    @Param('id') id: string,
    @Body() updateDiscussDTO: UpdateDiscussDTO,
  ) {
    return this.discussService.updateDiscuss(id, updateDiscussDTO);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: DiscussSerialization,
    description: 'Get all discuss success',
  })
  @ApiOperation({ summary: 'Get all discuss' })
  getAllDiscuss(@Query() findDiscussDTO: FindDiscussDTO) {
    const discussList = this.discussService.findAllDiscuss(
      findDiscussDTO.skip,
      findDiscussDTO.limit,
      findDiscussDTO.sort,
      findDiscussDTO.topicId,
    );
    return discussList;
  }

  @Patch('change-status/:id/status/:status')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object,
    description: 'change status discuss success',
  })
  @ApiOperation({ summary: 'Change status discuss' })
  updateStatusDiscuss(
    @Param('id') id: string,
    @Param('status') status: number,
  ) {
    return this.discussService.updateStatusDiscuss(id, status);
  }

  @Patch('trash-or-restore/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object,
    description: 'Move to trash or restore discuss success',
  })
  @ApiOperation({ summary: 'Move to trash or restore discuss' })
  moveToTrashOrRestore(@Param('id') id: string) {
    return this.discussService.moveDiscussToTrashOrRestore(id);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object,
    description: 'Remove discuss success',
  })
  @ApiOperation({ summary: 'Remove discuss' })
  removeDiscuss(@Param('id') id: string) {
    return this.discussService.removeDiscuss(id);
  }

  @Get(':id/increment-view')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object,
    description: 'Increment view success',
  })
  @ApiOperation({ summary: 'Increment view discuss by discussId' })
  incrementTotalView(@Param('id') id: string) {
    const updatedDiscuss = this.discussService.incrementTotalView(id);
    return { totalView: updatedDiscuss };
  }
}
