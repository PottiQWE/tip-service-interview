import Stripe from 'stripe';
import { TipsService } from './tips.service';

describe('TipsService', () => {
  const repo = {
    saveTip: jest.fn(),
    addToCreatorTotal: jest.fn(),
    findByCreator: jest.fn().mockResolvedValue([]),
  };
  const counter = { increment: jest.fn(), getTotal: jest.fn().mockResolvedValue(0) };
  const notifications = { notifyCreatorOfTip: jest.fn() };
  const creators = {
    findById: jest.fn().mockResolvedValue({ id: 'c1', stripeAccountId: 'acct_1' }),
    findByHandle: jest.fn().mockResolvedValue({ id: 'c1', handle: 'alice' }),
  };
  const stripe = {
    paymentIntents: { create: jest.fn().mockResolvedValue({ client_secret: 'pi_secret' }) },
  };

  const service = new TipsService(
    repo as any,
    counter as any,
    notifications as any,
    creators as any,
    stripe as any,
  );

  beforeEach(() => jest.clearAllMocks());

  it('creates a tip', async () => {
    const result = await service.createTip({
      creatorId: 'c1',
      amount: 5,
      currency: 'usd',
      fanEmail: 'fan@example.com',
    });

    expect(result).toBeDefined();
    expect(stripe.paymentIntents.create).toHaveBeenCalled();
  });

  it('handles a successful payment', async () => {
    const event = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          amount: 500,
          currency: 'usd',
          metadata: { creatorId: 'c1', fanEmail: 'fan@example.com', message: 'love it' },
        },
      },
    } as unknown as Stripe.Event;

    await service.handleStripeEvent(event);

    expect(repo.saveTip).toHaveBeenCalled();
    expect(repo.addToCreatorTotal).toHaveBeenCalled();
    expect(counter.increment).toHaveBeenCalled();
    expect(notifications.notifyCreatorOfTip).toHaveBeenCalled();
  });

  it('returns a summary', async () => {
    const summary = await service.getSummary('alice');
    expect(summary).toBeTruthy();
  });
});
