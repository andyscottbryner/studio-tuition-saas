'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function BillingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [gym, setGym] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const { data: gymRow } = await supabase.from('gyms').select('*').eq('owner_id', user.id).maybeSingle();
      setGym(gymRow || null);
      setLoading(false);
    })();
  }, [router]);

  async function callApi(path) {
    setBusy(true);
    setError('');
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ gymId: gym.id }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error || 'Something went wrong.');
      return;
    }
    window.location.href = json.url;
  }

  if (loading) return <div className="app"><p style={{ padding: 40 }}>Loading…</p></div>;

  const active = gym && ['active', 'trialing'].includes(gym.subscription_status);

  return (
    <div className="app">
      <div className="center-form card">
        <h2 style={{ marginBottom: 10 }}>Billing</h2>
        {gym && (
          <p style={{ marginBottom: 18 }}>
            Status:{' '}
            <span className={`status-pill ${active ? 'status-active' : 'status-inactive'}`}>
              {gym.subscription_status}
            </span>
          </p>
        )}
        {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

        {!active && (
          <>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 16 }}>
              Subscribe to unlock the calculator, customize, and invoice tools for your gym.
            </p>
            <button className="btn btn-amber" disabled={busy} onClick={() => callApi('/api/stripe/checkout')} style={{ width: '100%', justifyContent: 'center' }}>
              {busy ? 'Redirecting…' : 'Subscribe'}
            </button>
          </>
        )}

        {active && (
          <>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 16 }}>
              Manage your payment method, invoices, or cancel any time.
            </p>
            <button className="btn btn-teal" disabled={busy} onClick={() => callApi('/api/stripe/portal')} style={{ width: '100%', justifyContent: 'center' }}>
              {busy ? 'Redirecting…' : 'Manage Subscription'}
            </button>
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} onClick={() => router.push('/dashboard')}>
              Go to Calculator
            </button>
          </>
        )}
      </div>
    </div>
  );
}
