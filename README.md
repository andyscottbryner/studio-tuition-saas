# Studio Tuition Calculator — SaaS

Multi-tenant subscription web app. Each gym signs up, subscribes via Stripe, and
gets their own private workspace (classes, discounts, calculator, invoices).

## Stack

- **Next.js** — the app itself, frontend + backend API routes in one project
- **Supabase** — hosted Postgres database + login/auth, with Row Level Security
  so each gym can only ever see its own data
- **Stripe** — subscription billing (Checkout + customer portal + webhooks)
- **Vercel** — hosting

---

## 1. Local setup (do this first, to make sure it actually runs)

```bash
npm install
cp .env.example .env.local
# fill in .env.local with real values — see steps 2 and 3 below
npm run dev
```

Visit `http://localhost:3000`.

---

## 2. Set up Supabase (your database + login system)

1. Create a free project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — server only)
3. Open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`,
   and run it. This creates the `gyms` and `gym_config` tables and their
   security policies.
4. In **Authentication → Providers**, Email is enabled by default. For the
   simplest signup flow (no email confirmation step), go to
   **Authentication → Settings** and turn off "Confirm email" while you're
   testing. Turn it back on before you launch for real.

---

## 3. Set up Stripe (billing)

1. In your Stripe dashboard, go to **Product catalog → Add product**.
   Create a recurring product, e.g. "Studio Tuition Calculator — $29/month".
2. Copy the **Price ID** (starts with `price_...`) into
   `NEXT_PUBLIC_STRIPE_PRICE_ID`.
3. In **Developers → API keys**, copy your **Secret key** into
   `STRIPE_SECRET_KEY`. (Use a test-mode key while developing.)
4. The webhook secret (`STRIPE_WEBHOOK_SECRET`) comes from step 5 below —
   you need your site deployed first to get a real webhook URL.

---

## 4. Deploy — this is "setting up the backend server"

You don't need to rent or configure a server yourself. Next.js apps deploy to
**Vercel**, who run your backend code (the API routes) as on-demand serverless
functions — you never manage an OS, ports, or uptime.

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import that repo.
3. Before deploying, open **Environment Variables** and paste in everything
   from your `.env.local` (all the `NEXT_PUBLIC_...`, `SUPABASE_...`, and
   `STRIPE_...` values). Set `NEXT_PUBLIC_SITE_URL` to the Vercel URL you're
   about to get, e.g. `https://studio-tuition.vercel.app` (you can update this
   after the first deploy once you know the real URL).
4. Click **Deploy**. In a minute or two you'll have a live URL — that's your
   hosted backend and frontend together.
5. **Now wire up the Stripe webhook**, using your real deployed URL:
   - Stripe dashboard → **Developers → Webhooks → Add endpoint**
   - Endpoint URL: `https://YOUR-DOMAIN/api/stripe/webhook`
   - Events to send: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **Signing secret** (`whsec_...`) into Vercel's
     `STRIPE_WEBHOOK_SECRET` environment variable, then redeploy (Vercel →
     Deployments → ⋯ → Redeploy) so it picks up the new value.
6. Test end to end: sign up, go to Billing, subscribe with a Stripe test card
   (`4242 4242 4242 4242`, any future date, any CVC), and confirm you land back
   on the dashboard with an active subscription.

### Custom domain

In Vercel → your project → **Settings → Domains**, add your own domain (e.g.
`app.yourbusiness.com`) and follow the DNS instructions it gives you. Update
`NEXT_PUBLIC_SITE_URL` to match and redeploy.

### Going live for real

- Switch Stripe from test mode to live mode: swap in your live secret key and
  live price ID, and create a **second** webhook endpoint under live mode
  (test and live webhooks are separate).
- Turn "Confirm email" back on in Supabase Auth settings.

---

## How the data is isolated per gym

Every table has Row Level Security policies (see `supabase/schema.sql`) that
only allow a user to read or write rows where `owner_id` (or the related
`gym_id`) matches their own logged-in user ID. Even if a gym were somehow
compromised, an attacker still couldn't read another gym's data — the
database itself enforces the boundary, not just the app code.

## What isn't included yet

This is a working scaffold, not a finished product. Things you'll likely want
next: password reset flow, team members per gym (currently one login per
gym), usage analytics, a free-trial period configured in Stripe, and a
proper marketing/pricing page.
