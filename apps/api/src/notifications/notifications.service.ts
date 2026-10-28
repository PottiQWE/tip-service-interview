import { Injectable, Logger } from '@nestjs/common';
import { CreatorsRepository } from '../creators/creators.repository';
import { Tip } from '../tips/tip';
import { EmailClient } from './email.client';
import { PushClient } from './push.client';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly creators: CreatorsRepository,
    private readonly email: EmailClient,
    private readonly push: PushClient,
  ) {}

  async notifyCreatorOfTip(creatorId: string, tip: Tip): Promise<void> {
    const creator = await this.creators.findById(creatorId);
    if (!creator) return;

    const amount = (tip.amountCents / 100).toFixed(2);
    const title = `You received a $${amount} tip!`;

    await this.email.send({
      to: creator.email,
      subject: title,
      text: tip.message ? `"${tip.message}"` : 'Someone just tipped you.',
    });

    for (const token of creator.deviceTokens ?? []) {
      await this.push.send(token, { title, body: tip.message ?? '' });
    }

    this.logger.log(`Notified creator ${creatorId} of tip ${tip.id}`);
  }
}
