import { Inject, Injectable } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { DYNAMO, TABLE } from '../infra/infra.module';
import { Tip } from './tip';

@Injectable()
export class TipsRepository {
  constructor(@Inject(DYNAMO) private readonly db: DynamoDBDocumentClient) {}

  /**
   * Tips are partitioned by day so the daily payout report
   * can read a whole day with a single Query.
   */
  async saveTip(tip: Tip): Promise<void> {
    const day = tip.createdAt.slice(0, 10); // YYYY-MM-DD
    await this.db.send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          PK: `TIPS#${day}`,
          SK: `${tip.createdAt}#${tip.id}`,
          type: 'Tip',
          ...tip,
        },
      }),
    );
  }

  async findByCreator(creatorId: string): Promise<Tip[]> {
    const { Items } = await this.db.send(
      new ScanCommand({
        TableName: TABLE,
        FilterExpression: '#type = :type AND creatorId = :creatorId',
        ExpressionAttributeNames: { '#type': 'type' },
        ExpressionAttributeValues: { ':type': 'Tip', ':creatorId': creatorId },
      }),
    );

    return ((Items ?? []) as Tip[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async addToCreatorTotal(creatorId: string, amountCents: number): Promise<void> {
    const key = { PK: `CREATOR#${creatorId}`, SK: 'PROFILE' };

    const { Item } = await this.db.send(new GetCommand({ TableName: TABLE, Key: key }));
    const current = (Item?.totalTipsCents as number | undefined) ?? 0;

    await this.db.send(
      new PutCommand({
        TableName: TABLE,
        Item: { ...Item, ...key, totalTipsCents: current + amountCents },
      }),
    );
  }
}
