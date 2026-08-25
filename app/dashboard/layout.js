'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GymProvider, useGym } from '../../lib/GymContext';
import { supabase } from '../../lib/supabaseClient';

function Gate({ children }) {
  const { loading, user, gym } = useGym();
  const router = useRouter();
  const pathname = usePathname();

  if (loading) return <div className="app"><p style={{ padding: 40 }}>Loading…</p></div>;

  if (!user) {
    router.push('/login');
    return null;
  }
  if (!gym || !['active', 'trialing'].includes(gym.subscription_status)) {
    router.push('/billing');
    return null;
  }

  const tabs = [
    { href: '/dashboard', label: 'Calculator' },
    { href: '/dashboard/customize', label: 'Customize' },
    { href: '/dashboard/invoice', label: 'Invoice' },
  ];

  return (
    <div>
      <header className="top">
        <div className="top-inner">
          <div className="brand">
            <span className="mark">{gym.name || 'Studio'}</span>
            <h1 style={{ fontSize: 24 }}>Tuition Desk</h1>
          </div>
          <nav className="tabs">
            {tabs.map((t) => (
              <Link key={t.href} href={t.href} className={pathname === t.href ? 'active' : ''}>
                {t.label}
              </Link>
            ))}
            <Link href="/billing">Billing</Link>
            <a
              onClick={async (e) => { e.preventDefault(); await supabase.auth.signOut(); router.push('/login'); }}
              href="#"
            >
              Log Out
            </a>
          </nav>
        </div>
      </header>
      <div className="app" style={{ paddingTop: 28 }}>{children}</div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <GymProvider>
      <Gate>{children}</Gate>
    </GymProvider>
  );
}
