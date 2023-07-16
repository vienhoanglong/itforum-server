import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_PASSWORD'),
      },
    });
  }

  async sendMail(to: string, subject: string, html?: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get<string>('GMAIL_USER'),
      to,
      subject,
      html,
    });
  }
}
