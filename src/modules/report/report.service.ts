import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from 'src/common/schemas/report.schema';
import { CreateReportDto } from './dto';
import { DiscussService } from '../discuss/discuss.service';
import { PostsService } from '../posts/posts.service';
@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    private readonly discussService: DiscussService,
    private readonly postsService: PostsService,
  ) {}

  async createReport(createReportDto: CreateReportDto): Promise<Report> {
    try {
      const existing = await this.reportModel.findOne({
        idReference: createReportDto.idReference.toString(),
        createdBy: createReportDto.createdBy,
      });
      if (existing)
        throw new NotImplementedException(
          'You have already reported this content.',
        );
      const createdReport = new this.reportModel(createReportDto);
      return createdReport.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async approveReport(reportId: string, reasonBan?: string): Promise<Report> {
    try {
      const report = await this.reportModel.findById(reportId).exec();
      if (!report) throw new NotFoundException('Report not found');
      switch (report.reportBelong) {
        case 'Posts':
          await this.postsService.updatePostsReport(
            report.idReference.toString(),
            2,
            reasonBan,
          );
          break;
        case 'Discuss':
          await this.discussService.updateDiscussReport(
            report.idReference.toString(),
            2,
            reasonBan,
          );
          break;
        default:
          throw new BadGatewayException('Invalid');
      }
      report.status = 'Approved';
      return await report.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findAllReport(
    skip?: number,
    limit?: number,
    sort?: 'asc' | 'desc',
  ): Promise<Report[]> {
    try {
      const sortField = 'createdAt';
      const sortOptions: any = {};
      sortOptions[sortField] = sort === 'asc' ? 1 : -1;
      const reportList = await this.reportModel
        .find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec();
      return reportList;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findByReportId(id: string): Promise<Report> {
    try {
      return this.reportModel.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
