import { notFound } from 'next/navigation';
import { TipPanel } from '../../../components/TipPanel';

async function getTipsSummary(handle: string) {
  const res = await fetch(`${process.env.API_URL}/creators/${handle}/tips-summary`, {
    cache: 'no-store', // totals must be live
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function CreatorPage({ params }: { params: { handle: string } }) {
  const data = await getTipsSummary(params.handle);
  if (!data) notFound();

  const { creator } = data;

  return (
    <main>
      {creator.avatarUrl && <img src={creator.avatarUrl} alt="" width={96} height={96} />}
      <h1>{creator.displayName}</h1>
      <p>@{creator.handle}</p>
      {creator.bio && <p>{creator.bio}</p>}

      <TipPanel data={data} />
    </main>
  );
}
