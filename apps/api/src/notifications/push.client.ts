import { Injectable } from '@nestjs/common';

export interface PushPayload {
  title: string;
  body: string;
}

/** Thin wrapper around the push provider (FCM/APNs). */
@Injectable()
export class PushClient {
  async send(deviceToken: string, payload: PushPayload): Promise<void> {
    // provider call omitted in this exercise
  }
}
