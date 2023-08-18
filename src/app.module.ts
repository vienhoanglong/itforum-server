import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import * as dotenv from 'dotenv';
import { UserModule } from './modules/user/user.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { TopicModule } from './modules/topic/topic.module';
import { DiscussModule } from './modules/discuss/discuss.module';
import { CommentModule } from './modules/comment/comment.module';
import { GroupChatModule } from './modules/chat/group-chat/group-chat.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ConversationModule } from './modules/chat/conversation/conversation.module';
import { MessageModule } from './modules/chat/message/message.module';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UserModule,
    TopicModule,
    DiscussModule,
    CommentModule,
    GroupChatModule,
    NotificationModule,
    ConversationModule,
    MessageModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
