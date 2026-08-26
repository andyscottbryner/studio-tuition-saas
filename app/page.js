import Link from 'next/link';
import { Dumbbell, Users, Receipt, Percent } from 'lucide-react';

function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 360" width="100%" height="auto" role="img" aria-label="Tuition clipboard illustration">
      <defs>
        <linearGradient id="matGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F1ECE0" />
          <stop offset="100%" stopColor="#E3DCC9" />
        </linearGradient>
      </defs>

      <ellipse cx="240" cy="320" rx="170" ry="18" fill="#DDD6C4" opacity="0.6" />

      <rect x="150" y="60" width="180" height="240" rx="10" fill="#FFFFFF" stroke="#1C2126" strokeWidth="3" />
      <rect x="150" y="60" width="180" height="240" rx="10" fill="url(#matGrad)" opacity="0.25" />
      <rect x="196" y="46" width="88" height="28" rx="8" fill="#1C2126" />
      <rect x="210" y="38" width="60" height="18" rx="6" fill="#E8A33D" stroke="#1C2126" strokeWidth="3" />

      <rect x="172" y="100" width="136" height="10" rx="3" fill="#1C2126" />
      <rect x="172" y="122" width="90" height="8" rx="3" fill="#DDD6C4" />
      <rect x="172" y="140" width="110" height="8" rx="3" fill="#DDD6C4" />
      <rect x="172" y="158" width="70" height="8" rx="3" fill="#DDD6C4" />

      <rect x="172" y="182" width="136" height="46" rx="6" fill="#204F42" />
      <text x="240" y="211" textAnchor="middle" fontFamily="monospace" fontSize="20" fontWeight="700" fill="#E8A33D">
        $128.00
      </text>

      <rect x="172" y="238" width="136" height="8" rx="3" fill="#DDD6C4" />
      <rect x="172" y="256" width="96" height="8" rx="3" fill="#DDD6C4" />

      <circle cx="300" cy="270" r="18" fill="#E8A33D" stroke="#1C2126" strokeWidth="3" />
      <path d="M292 270 L298 276 L310 262" stroke="#1C2126" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      <g transform="translate(56,190) rotate(-18)">
        <rect x="0" y="14" width="70" height="10" rx="5" fill="#1C2126" />
        <rect x="-10" y="0" width="16" height="38" rx="4" fill="#B5482F" />
        <rect x="64" y="0" width="16" height="38" rx="4" fill="#B5482F" />
      </g>

      <g transform="translate(354,110) rotate(14)">
        <rect x="0" y="10" width="52" height="8" rx="4" fill="#1C2126" />
        <rect x="-8" y="0" width="12" height="28" rx="3" fill="#2F6F5E" />
        <rect x="48" y="0" width="12" height="28" rx="3" fill="#2F6F5E" />
      </g>
    </svg>
  );
}

export default function HomePage() {
  return (
    <div>
      <header className="top" style={{ paddingBottom: 20 }}>
        <div className="top-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div className="brand" style={{ marginBottom: 0 }}>
            <span className="mark">SaaS</span>
            <h1>Studio Tuition Calculator</h1>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <a href="#examples" style={{ color: '#9AA3AC', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '0.03em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Learn More
            </a>
            <Link href="/login" style={{ color: '#9AA3AC', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '0.03em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Log In
            </Link>
          </nav>
        </div>
      </header>
      <div className="app">
        <div className="hero" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', alignItems: 'center', gap: 32, textAlign: 'left', padding: '56px 0' }}>
          <div>
            <h1 style={{ fontSize: 44, textAlign: 'left', margin: 0 }}>Quote a family in seconds.</h1>
            <p style={{ textAlign: 'left', margin: '14px 0 24px', maxWidth: 480 }}>
              Prorated tuition, multi-class and sibling discounts, printable invoices —
              built for gym and studio front desks. Set it up once, subscribe, and every
              location logs in to their own workspace.
            </p>
            <Link href="/signup" className="btn btn-amber">Start Free Trial</Link>{' '}
            <Link href="/login" className="btn btn-ghost">Log In</Link>
          </div>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <HeroIllustration />
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <div className="card-title">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Users size={20} style={{ color: 'var(--amber-deep)' }} />
                For your front desk
              </h2>
            </div>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
              Pick a student's classes and how many meetings are left this month —
              the prorated first-month total and recurring monthly tuition calculate
              automatically, discounts included.
            </p>
          </div>
          <div className="card">
            <div className="card-title">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Receipt size={20} style={{ color: 'var(--amber-deep)' }} />
                One subscription, your whole gym
              </h2>
            </div>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
              Your classes, pricing, and discount rules live in your account — not
              one browser on one computer. Log in from the front desk, the office,
              anywhere.
            </p>
          </div>
          <div className="card">
            <div className="card-title">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Percent size={20} style={{ color: 'var(--amber-deep)' }} />
                Discounts built in
              </h2>
            </div>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
              Multi-class and sibling discounts calculate automatically, so front
              desk staff never have to do the math by hand.
            </p>
          </div>
          <div className="card">
            <div className="card-title">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Dumbbell size={20} style={{ color: 'var(--amber-deep)' }} />
                Built for gyms
              </h2>
            </div>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
              Designed around how gyms and studios actually quote and invoice
              families — not a generic spreadsheet template.
            </p>
          </div>
        </div>

        <div id="examples" style={{ paddingTop: 56, scrollMarginTop: 24 }}>
          <h2 style={{ fontSize: 28, marginBottom: 6 }}>See it in action</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 24, maxWidth: 560 }}>
            Three real front-desk moments — this is exactly what the Calculator produces automatically.
          </p>

          <div className="grid grid-2">
            <div className="card">
              <div className="card-title"><h2 style={{ fontSize: 18 }}>Ava — joins mid-month</h2></div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 10 }}>
                Tumbling ($120/mo), 2 of 4 classes left this month (50% prorated).
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>Prorated first month</span><span className="num">$60.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>Registration fee</span><span className="num">$50.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, borderTop: '1px solid var(--line)', paddingTop: 8, marginTop: 6 }}>
                <span>Due today</span><span className="num" style={{ color: 'var(--teal-deep)' }}>$110.00</span>
              </div>
            </div>

            <div className="card">
              <div className="card-title"><h2 style={{ fontSize: 18 }}>Jack — takes 2 classes</h2></div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 10 }}>
                Tumbling ($120) + Ninja Warrior ($110 at an 80% multi-class rate).
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>Tumbling</span><span className="num">$120.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>Ninja Warrior (80%)</span><span className="num">$88.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, borderTop: '1px solid var(--line)', paddingTop: 8, marginTop: 6 }}>
                <span>Recurring monthly</span><span className="num" style={{ color: 'var(--teal-deep)' }}>$208.00</span>
              </div>
            </div>

            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <div className="card-title"><h2 style={{ fontSize: 18 }}>The Reyes family — two siblings enrolled</h2></div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 10 }}>
                Student 1: Tumbling ($120, full price). Student 2: Cheer Team ($130 at a 75% sibling rate).
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>Student 1 — Tumbling</span><span className="num">$120.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>Student 2 — Cheer Team (75% sibling rate)</span><span className="num">$97.50</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, borderTop: '1px solid var(--line)', paddingTop: 8, marginTop: 6 }}>
                <span>Family's recurring monthly</span><span className="num" style={{ color: 'var(--teal-deep)' }}>$217.50</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 14 }}>
            Discount rates shown are examples — you set your own multi-class, sibling, and registration fee rules in Customize.
          </p>
        </div>
      </div>
    </div>
  );
}
