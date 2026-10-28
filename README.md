# tip-service

Creator platform monorepo (interview exercise — trimmed down, not meant to be run).

```
apps/
  api/   NestJS API (DynamoDB single-table, Redis, Stripe Connect)
  web/   Next.js App Router frontend
docs/
  specs/ product specs
```

## Data model (single table `app`)

| Entity  | PK                | SK        | GSI1PK            |
| ------- | ----------------- | --------- | ----------------- |
| Creator | `CREATOR#<id>`    | `PROFILE` | `HANDLE#<handle>` |

## Infra

- DynamoDB (on-demand), table `app`
- ElastiCache Redis
- API runs on ECS Fargate; async work goes through SQS + Lambda
- Payments: Stripe Connect (creators have connected Express accounts)
