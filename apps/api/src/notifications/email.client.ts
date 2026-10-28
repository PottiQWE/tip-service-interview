import { Injectable } from '@nestjs/common';

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
}

/** Thin wrapper around the transactional email provider (SES). */
@Injectable()
export class EmailClient {
  async send(message: EmailMessage): Promise<void> {
    // provider call omitted in this exercise
  }
}
