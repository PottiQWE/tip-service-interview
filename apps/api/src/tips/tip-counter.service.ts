import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS } from '../infra/infra.module';
import { TipsRepository } from './tips.repository';

const TTL_SECONDS = 60;

/** Live tip total per creator, cached in Redis. */
@Injectable()
export class TipCounterService {
  constructor(
    @Inject(REDIS) private readonly redis: Redis,
    private readonly repo: TipsRepository,
  ) {}

  private key(creatorId: string) {
    return `tips:total:${creatorId}`;
  }

  async increment(creatorId: string, amountCents: number): Promise<void> {
    const current = Number((await this.redis.get(this.key(creatorId))) ?? 0);
    await this.redis.set(this.key(creatorId), current + amountCents, 'EX', TTL_SECONDS);
  }

  async getTotal(creatorId: string): Promise<number> {
    const cached = await this.redis.get(this.key(creatorId));
    if (cached !== null) return Number(cached);

    // Cache miss: rebuild from the source of truth
    const tips = await this.repo.findByCreator(creatorId);
    const total = tips.reduce((sum, t) => sum + t.amountCents, 0);

    await this.redis.set(this.key(creatorId), total, 'EX', TTL_SECONDS);
    return total;
  }
}
