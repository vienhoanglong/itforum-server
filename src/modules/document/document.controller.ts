import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
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
import { CreateFileDocumentDto } from './dto';
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
}
