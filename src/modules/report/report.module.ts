import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { DiscussModule } from '../discuss/discuss.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [DatabaseModule, DiscussModule, PostsModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
