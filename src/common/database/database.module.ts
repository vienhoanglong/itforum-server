import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChatGPTMessage,
  ChatGPTMessageSchema,
} from '../schemas/chatgpt.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://vienlongdev:lerWpglnZ2jFCFYj@cluster0.6ul8lgy.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    ),
    MongooseModule.forFeature([
      { name: ChatGPTMessage.name, schema: ChatGPTMessageSchema },
      { name: User.name, schema: UserSchema },
      //Add more...
    ]),
  ],
  exports: [MongooseModule],
})
// export class DatabaseModule {}
export class DatabaseModule {
  constructor() {
    console.log('Connected to MongoDB Atlas successfully');
  }
}
