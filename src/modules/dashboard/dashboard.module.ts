import { Module } from '@nestjs/common';
import { PostsModule } from '../posts/posts.module';
import { DiscussModule } from '../discuss/discuss.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ReportModule } from '../report/report.module';
import { UserModule } from '../user/user.module';
import { TopicModule } from '../topic/topic.module';

@Module({
  imports: [PostsModule, DiscussModule, ReportModule, UserModule, TopicModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
