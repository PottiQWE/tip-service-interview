export class CreateTipDto {
  creatorId: string;
  /** Tip amount in major units, e.g. 5.5 = $5.50 */
  amount: number;
  currency: string;
  fanEmail: string;
  message?: string;
}
