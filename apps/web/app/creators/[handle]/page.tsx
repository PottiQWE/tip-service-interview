import { notFound } from 'next/navigation';

type PublicCreator = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
};

async function getCreator(handle: string): Promise<PublicCreator | null> {
  const res = await fetch(`${process.env.API_URL}/creators/${handle}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function CreatorPage({ params }: { params: { handle: string } }) {
  const creator = await getCreator(params.handle);
  if (!creator) notFound();

  return (
    <main>
      {creator.avatarUrl && <img src={creator.avatarUrl} alt="" width={96} height={96} />}
      <h1>{creator.displayName}</h1>
      <p>@{creator.handle}</p>
      {creator.bio && <p>{creator.bio}</p>}
    </main>
  );
}
