import { Global, Module } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import Redis from 'ioredis';
import Stripe from 'stripe';

export const DYNAMO = Symbol('DYNAMO');
export const REDIS = Symbol('REDIS');
export const STRIPE = Symbol('STRIPE');
export const TABLE = process.env.TABLE_NAME ?? 'app';

@Global()
@Module({
  providers: [
    {
      provide: DYNAMO,
      useFactory: () =>
        DynamoDBDocumentClient.from(new DynamoDBClient({}), {
          marshallOptions: { removeUndefinedValues: true },
        }),
    },
    {
      provide: REDIS,
      useFactory: () => new Redis(process.env.REDIS_URL!),
    },
    {
      provide: STRIPE,
      useFactory: () => new Stripe(process.env.STRIPE_SECRET_KEY!),
    },
  ],
  exports: [DYNAMO, REDIS, STRIPE],
})
export class InfraModule {}
