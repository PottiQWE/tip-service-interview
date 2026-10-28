import { Inject, Injectable } from '@nestjs/common';
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DYNAMO, TABLE } from '../infra/infra.module';
import { Creator } from './creator';

@Injectable()
export class CreatorsRepository {
  constructor(@Inject(DYNAMO) private readonly db: DynamoDBDocumentClient) {}

  async findById(id: string): Promise<Creator | null> {
    const { Item } = await this.db.send(
      new GetCommand({
        TableName: TABLE,
        Key: { PK: `CREATOR#${id}`, SK: 'PROFILE' },
      }),
    );
    return (Item as Creator) ?? null;
  }

  async findByHandle(handle: string): Promise<Creator | null> {
    const { Items } = await this.db.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: { ':pk': `HANDLE#${handle.toLowerCase()}` },
        Limit: 1,
      }),
    );
    return (Items?.[0] as Creator) ?? null;
  }
}
