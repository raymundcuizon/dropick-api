import { Injectable } from '@nestjs/common';
import { TwilioService } from '@lkaric/twilio-nestjs';

@Injectable()
export class SendMeSms {
  constructor(private readonly twilioService: TwilioService) {}

  async sendSms(body: string, from: string, to: string) {
    try {
      const message = await this.twilioService.client.messages.create({ body, from, to });
      return message;
    } catch (error) {
      return error;
    }
  }
}
