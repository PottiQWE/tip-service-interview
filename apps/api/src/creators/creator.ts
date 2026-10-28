export interface Creator {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  // private
  email: string;
  stripeAccountId: string;
  deviceTokens: string[];
  totalTipsCents?: number;
}

export type PublicCreator = Pick<Creator, 'id' | 'handle' | 'displayName' | 'avatarUrl' | 'bio'>;

export function toPublicCreator(c: Creator): PublicCreator {
  return {
    id: c.id,
    handle: c.handle,
    displayName: c.displayName,
    avatarUrl: c.avatarUrl,
    bio: c.bio,
  };
}
