import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { UtilModule } from '../util/util.module';
import { DiscussModule } from '../discuss/discuss.module';

@Module({
  imports: [DatabaseModule, UtilModule, DiscussModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
