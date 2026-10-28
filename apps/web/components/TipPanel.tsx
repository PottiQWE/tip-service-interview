'use client';

import { useState } from 'react';

type Tip = {
  id: string;
  amountCents: number;
  fanEmail: string;
  message?: string;
  createdAt: string;
};

type Props = {
  data: {
    creator: { id: string; displayName: string };
    totalCents: number;
    recentTips: Tip[];
  };
};

const PRESETS = [2, 5, 10, 25];

export function TipPanel({ data }: Props) {
  const [amount, setAmount] = useState(5);
  const [message, setMessage] = useState('');

  async function sendTip() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creatorId: data.creator.id,
        amount,
        currency: 'usd',
        fanEmail: window.localStorage.getItem('email'),
        message,
      }),
    });
    const { clientSecret } = await res.json();
    // Stripe Elements confirmation handled by <PaymentSheet /> (next PR)
    console.log('PaymentIntent created', clientSecret);
  }

  return (
    <section>
      <h2>${(data.totalCents / 100).toFixed(2)} in tips</h2>

      <div>
        {PRESETS.map((p) => (
          <button key={p} onClick={() => setAmount(p)} aria-pressed={amount === p}>
            ${p}
          </button>
        ))}
      </div>
      <input
        placeholder={`Say something to ${data.creator.displayName}`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendTip}>Send tip</button>

      <ul>
        {data.recentTips.map((tip) => (
          <li key={tip.id}>
            <strong>{tip.fanEmail.split('@')[0]}</strong> tipped ${(tip.amountCents / 100).toFixed(2)}
            {tip.message && <> — {tip.message}</>}
          </li>
        ))}
      </ul>
    </section>
  );
}
