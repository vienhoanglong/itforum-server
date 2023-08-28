import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ChatGPTService {
  constructor(private readonly configService: ConfigService) {}
  async sendMessage(prompt: string): Promise<string> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    const requestData = {
      model: 'gpt-3.5-turbo-16k',
      messages: [{ role: 'user', content: prompt }],
    };

    try {
      const response = await axios.post(apiUrl, requestData, { headers });
      const content = response.data.choices[0].message.content.trim();
      return content;
    } catch (error) {
      throw new Error('Failed to send message');
    }
  }
}
