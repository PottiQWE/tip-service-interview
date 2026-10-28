import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateTipDto } from './dto/create-tip.dto';
import { TipsService } from './tips.service';

@Controller()
export class TipsController {
  constructor(private readonly tips: TipsService) {}

  /** Starts a tip: returns a PaymentIntent client secret for Stripe Elements. */
  @Post('tips')
  async create(@Body() dto: CreateTipDto) {
    return this.tips.createTip(dto);
  }

  /** Total + recent tips for the creator page. */
  @Get('creators/:handle/tips-summary')
  async summary(@Param('handle') handle: string) {
    return this.tips.getSummary(handle);
  }

  /** Stripe webhook endpoint. */
  @Post('webhooks/stripe')
  @HttpCode(200)
  async stripeWebhook(@Body() event: Stripe.Event) {
    await this.tips.handleStripeEvent(event);
    return { received: true };
  }
}
