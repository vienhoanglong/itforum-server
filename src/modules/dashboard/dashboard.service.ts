import { BadRequestException, Injectable } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { DiscussService } from '../discuss/discuss.service';
import * as moment from 'moment';
import { ReportService } from '../report/report.service';
import { UserService } from '../user/user.service';
import { TopicService } from '../topic/topic.service';
@Injectable()
export class DashboardService {
  constructor(
    private readonly postsService: PostsService,
    private readonly discussService: DiscussService,
    private readonly reportService: ReportService,
    private readonly userService: UserService,
    private readonly topicService: TopicService,
  ) {}
  async getStatisticsByPeriod(type: string, value: string): Promise<any> {
    try {
      const data = [];

      const currentDate = moment();
      const periods = Number(value);

      for (let i = 0; i < periods; i++) {
        let start: moment.Moment;
        let end: moment.Moment;
        if (type === 'week') {
          start = currentDate
            .clone()
            .subtract(i * 7, 'days')
            .startOf('isoWeek');
          end = currentDate
            .clone()
            .subtract(i * 7, 'days')
            .endOf('isoWeek');
        } else if (type === 'month') {
          start = currentDate.clone().subtract(i, 'months').startOf('month');
          end = currentDate.clone().subtract(i, 'months').endOf('month');
        } else if (type === 'year') {
          start = currentDate.clone().subtract(i, 'years').startOf('year');
          end = currentDate.clone().subtract(i, 'years').endOf('year');
        } else {
          return [];
        }
        const postsCount = await this.postsService.countDocumentPosts(
          start,
          end,
        );
        const discussCount = await this.discussService.countDocumentDiscuss(
          start,
          end,
        );
        data.push({
          name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`,
          post: postsCount,
          discuss: discussCount,
          amt: postsCount + discussCount,
        });
      }
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getTypeReportStatistics(): Promise<any> {
    try {
      const typeReportCounts = await this.reportService.typeReportCount();
      const dataPie = typeReportCounts.map((item) => ({
        name: item._id,
        value: item.count,
      }));

      return dataPie;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getUserByRoleStatistic(): Promise<any> {
    try {
      const roleCounts = await this.userService.countUserByRole();
      const roleMapping = {
        0: 'Admin',
        1: 'Teacher',
        2: 'Student',
        3: 'Company',
      };
      const roleData = roleCounts.map((item) => ({
        role: roleMapping[item._id],
        count: item.count,
      }));
      return roleData;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getTopTopic(): Promise<any> {
    try {
      const topicPosts = await this.postsService.getTopHashTag();
      const topicDiscuss = await this.discussService.getTopTopic();
      const allTopics = [...topicPosts, ...topicDiscuss];
      const topicCounts = {};

      for (const topic of allTopics) {
        const topicId = topic._id;
        const topicCount = topic.count;
        const topicInfo = await this.topicService.findTopicNameById(topicId);

        if (topicInfo) {
          const { name, color } = topicInfo;
          if (topicCounts[name]) {
            topicCounts[name].count += topicCount;
          } else {
            topicCounts[name] = {
              count: topicCount,
              color: color,
            };
          }
        }
      }

      const sortedTopics = Object.keys(topicCounts).map((topicName) => ({
        topic: topicName,
        count: topicCounts[topicName].count,
        color: topicCounts[topicName].color,
      }));

      sortedTopics.sort((a, b) => b.count - a.count);
      const top3Topics = sortedTopics.slice(0, 3);

      return top3Topics;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
