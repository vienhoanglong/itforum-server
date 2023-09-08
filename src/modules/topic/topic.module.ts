import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { RedisCacheModule } from '../lib/redis-cache/redis-cache.module';

@Module({
  imports: [DatabaseModule, RedisCacheModule],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
