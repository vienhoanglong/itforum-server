import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { FirebaseModule } from '../lib/firebase/firebase.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { UserModule } from '../user/user.module';
import { TopicModule } from '../topic/topic.module';

@Module({
  imports: [DatabaseModule, FirebaseModule, UserModule, TopicModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
