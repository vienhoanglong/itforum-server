import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from '../schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { User, UserSchema } from '../schemas/user.schema';
import { Topic, TopicSchema } from '../schemas/topic.schema';
import { Discuss, DiscussSchema } from '../schemas/discuss.schema';
import { CommentSchema, Comment } from '../schemas/comment.schema';
import { GroupChat, GroupChatSchema } from '../schemas/group-chat.schema';
import {
  Notification,
  NotificationSchema,
} from '../schemas/notification.schema';
import {
  Conversation,
  ConversationSchema,
} from '../schemas/conversation.schema';
import { Message, MessageSchema } from '../schemas/message.schema';
import { Files, FilesSchema } from '../schemas/document.schema';

dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // import the ConfigModule
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // import the ConfigModule
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('DB_NAME'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService], // inject the ConfigService
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Topic.name, schema: TopicSchema },
      { name: Discuss.name, schema: DiscussSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: GroupChat.name, schema: GroupChatSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Files.name, schema: FilesSchema },

      //Add more...
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
// export class DatabaseModule {
//   constructor() {
//     console.log('Connected to MongoDB Atlas successfully');
//   }
// }
