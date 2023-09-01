import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { ApproveReportDto, CreateReportDto, FindReportDto } from './dto';
import { Report } from 'src/common/schemas/report.schema';
@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('/approve')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Report,
    description: 'Approve report success',
  })
  @ApiOperation({ summary: 'Approve report' })
  approveReport(@Body() approveReportDto: ApproveReportDto) {
    return this.reportService.approveReport(
      approveReportDto.reportId,
      approveReportDto.reportId,
    );
  }
  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: Report,
    description: 'Create report success',
  })
  @ApiOperation({ summary: 'Create new report' })
  createReport(@Body() createReportDto: CreateReportDto) {
    return this.reportService.createReport(createReportDto);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Report,
    description: 'Get report by id success',
  })
  @ApiOperation({ summary: 'Get report by reportId' })
  findReportById(@Param('id') id: string) {
    return this.reportService.findByReportId(id);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: [Report],
    description: 'Get all report success',
  })
  @ApiOperation({ summary: 'Get all report' })
  getAllReport(@Query() findReportDto: FindReportDto) {
    const { skip, limit, sort } = findReportDto;
    return this.reportService.findAllReport(skip, limit, sort);
  }
}
