import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ChatGPTMessage } from 'src/common/schemas/chatgpt.schema';

@Injectable()
export class ChatGPTService {
  private readonly openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    }),
  );
  constructor(
    @InjectModel(ChatGPTMessage.name)
    private chatGPTMessageModel: Model<ChatGPTMessage>,
  ) {}

  async sendMessage(prompt: string): Promise<string> {
    const completions = await this.openai.createCompletion({
      model: 'davinci',
      prompt: prompt,
      max_tokens: 7,
      temperature: 0,
      top_p: 1,
      n: 1,
      stream: false,
      logprobs: null,
      stop: '\n',
    });

    const response = completions.data.choices[0].text.trim();
    return response;
  }

  async saveMessage(message: string): Promise<void> {
    const chatGPTMessage = new this.chatGPTMessageModel({
      message: message,
    });
    await chatGPTMessage.save();
  }
}
