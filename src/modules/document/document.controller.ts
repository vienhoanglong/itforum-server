import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { CreateFileDocumentDto, FindDocumentDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentSerialization } from './serialization/document.serialization';

@ApiTags('Documents')
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File/Image and Document Data',
    type: CreateFileDocumentDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: HttpStatus.OK,
    type: DocumentSerialization,
    description: 'Create document file success',
  })
  @ApiOperation({ summary: 'Create document file' })
  createDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDocumentDto: CreateFileDocumentDto,
  ) {
    return this.documentService.createFileDocument(createFileDocumentDto, file);
  }

  @Get('topic/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [DocumentSerialization],
    description: 'Get document file by topicId success',
  })
  @ApiOperation({ summary: 'Get document file by topicId' })
  getDocumentByTopicId(@Param('topicId') topicId: string) {
    return this.documentService.getFileDocumentByTopic(topicId);
  }
  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'Get document file by documentId success',
  })
  @ApiOperation({ summary: 'Get document file by documentId' })
  deleteDocument(@Param('id') documentId: string) {
    return this.documentService.deleteDocument(documentId);
  }
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: [DocumentSerialization],
    description: 'Get all document by topicId success',
  })
  @ApiOperation({ summary: 'Get all document by topicId' })
  getAllDiscuss(@Query() findDocumentDto: FindDocumentDto) {
    const discussList =
      this.documentService.findAllByTopicIdAndType(findDocumentDto);
    return discussList;
  }
}
