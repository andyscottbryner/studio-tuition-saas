import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <header className="top" style={{ paddingBottom: 20 }}>
        <div className="top-inner">
          <div className="brand">
            <span className="mark">SaaS</span>
            <h1>Studio Tuition Calculator</h1>
          </div>
        </div>
      </header>
      <div className="app">
        <div className="hero">
          <h1>Quote a family in seconds.</h1>
          <p>
            Prorated tuition, multi-class and sibling discounts, printable invoices —
            built for gym and studio front desks. Set it up once, subscribe, and every
            location logs in to their own workspace.
          </p>
          <Link href="/signup" className="btn btn-amber">Start Free Trial</Link>{' '}
          <Link href="/login" className="btn btn-ghost">Log In</Link>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <div className="card-title"><h2>For your front desk</h2></div>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
              Pick a student's classes and how many meetings are left this month —
              the prorated first-month total and recurring monthly tuition calculate
              automatically, discounts included.
            </p>
          </div>
          <div className="card">
            <div className="card-title"><h2>One subscription, your whole gym</h2></div>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
              Your classes, pricing, and discount rules live in your account — not
              one browser on one computer. Log in from the front desk, the office,
              anywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
