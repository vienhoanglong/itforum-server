import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { DiscussController } from './discuss.controller';
import { DiscussService } from './discuss.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DiscussController],
  providers: [DiscussService],
})
export class DiscussModule {}
