'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { defaultConfig } from '../../lib/defaultConfig';

export default function SignupPage() {
  const router = useRouter();
  const [gymName, setGymName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setBusy(false);
      setError(signUpError.message);
      return;
    }

    // If email confirmation is required, there's no session yet — the gym
    // row gets created the first time they log in successfully (see note
    // in README about wiring this up, or disable email confirmation in
    // Supabase Auth settings for the simplest flow).
    if (!data.session) {
      setBusy(false);
      setNotice('Check your email to confirm your account, then log in.');
      return;
    }

    const { data: gymRow, error: gymError } = await supabase
      .from('gyms')
      .insert({ owner_id: data.user.id, name: gymName, email })
      .select()
      .single();

    if (gymError) {
      setBusy(false);
      setError(gymError.message);
      return;
    }

    await supabase.from('gym_config').insert({
      gym_id: gymRow.id,
      classes: defaultConfig.classes,
      multi: defaultConfig.multi,
      sibling: defaultConfig.sibling,
      reg_fee: defaultConfig.reg_fee,
      notes: '',
    });

    setBusy(false);
    router.push('/billing');
  }

  return (
    <div className="app">
      <div className="center-form card">
        <h2 style={{ marginBottom: 18 }}>Start Your Free Trial</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label className="field-label">Gym / Studio Name</label>
            <input type="text" value={gymName} onChange={(e) => setGymName(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="field-label">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="field-label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
          {notice && <p style={{ color: 'var(--teal-deep)', fontSize: 13, marginBottom: 12 }}>{notice}</p>}
          <button className="btn btn-amber" type="submit" disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>
            {busy ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 16 }}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
