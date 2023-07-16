import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from '../schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { User, UserSchema } from '../schemas/user.schema';
import { Topic, TopicSchema } from '../schemas/topic.schema';

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
