export interface Tip {
  id: string;
  creatorId: string;
  amountCents: number;
  currency: string;
  fanEmail: string;
  message?: string;
  createdAt: string;
}
