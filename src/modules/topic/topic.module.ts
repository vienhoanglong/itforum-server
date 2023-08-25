import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
