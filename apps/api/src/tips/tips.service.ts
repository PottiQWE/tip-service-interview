import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import Stripe from 'stripe';
import { STRIPE } from '../infra/infra.module';
import { CreatorsRepository } from '../creators/creators.repository';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateTipDto } from './dto/create-tip.dto';
import { TipCounterService } from './tip-counter.service';
import { TipsRepository } from './tips.repository';
import { Tip } from './tip';

@Injectable()
export class TipsService {
  constructor(
    private readonly repo: TipsRepository,
    private readonly counter: TipCounterService,
    private readonly notifications: NotificationsService,
    private readonly creators: CreatorsRepository,
    @Inject(STRIPE) private readonly stripe: Stripe,
  ) {}

  async createTip(dto: CreateTipDto) {
    const creator = await this.creators.findById(dto.creatorId);
    if (!creator) throw new NotFoundException('Creator not found');

    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(dto.amount * 100),
      currency: dto.currency,
      transfer_data: { destination: creator.stripeAccountId },
      metadata: {
        creatorId: creator.id,
        fanEmail: dto.fanEmail,
        message: dto.message ?? '',
      },
    });

    return { clientSecret: intent.client_secret };
  }

  async handleStripeEvent(event: Stripe.Event) {
    if (event.type !== 'payment_intent.succeeded') return;

    const intent = event.data.object as Stripe.PaymentIntent;
    const { creatorId, fanEmail, message } = intent.metadata;

    const tip: Tip = {
      id: randomUUID(),
      creatorId,
      amountCents: intent.amount,
      currency: intent.currency,
      fanEmail,
      message: message || undefined,
      createdAt: new Date().toISOString(),
    };

    await this.repo.saveTip(tip);
    await this.repo.addToCreatorTotal(creatorId, tip.amountCents);
    await this.counter.increment(creatorId, tip.amountCents);
    await this.notifications.notifyCreatorOfTip(creatorId, tip);
  }

  async getSummary(handle: string) {
    const creator = await this.creators.findByHandle(handle);
    if (!creator) throw new NotFoundException('Creator not found');

    const total = await this.counter.getTotal(creator.id);
    const tips = await this.repo.findByCreator(creator.id);

    return {
      creator,
      totalCents: total,
      recentTips: tips.slice(0, 20),
    };
  }
}
