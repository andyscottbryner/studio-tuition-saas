-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

create extension if not exists "pgcrypto";

-- One row per subscribing gym.
create table if not exists gyms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null default '',
  phone text default '',
  address text default '',
  email text default '',
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text not null default 'inactive', -- inactive | trialing | active | past_due | canceled
  created_at timestamptz not null default now()
);

-- One row per gym: their classes, discounts, fees, notes.
create table if not exists gym_config (
  gym_id uuid primary key references gyms(id) on delete cascade,
  classes jsonb not null default '[]',
  multi jsonb not null default '[100,100,100,100]',
  sibling jsonb not null default '[100,100,100,100]',
  reg_fee jsonb not null default '[0,0,0,0,0]',
  notes text not null default '',
  updated_at timestamptz not null default now()
);

alter table gyms enable row level security;
alter table gym_config enable row level security;

-- Owners can fully manage their own gym row.
create policy "gyms: owner select" on gyms for select using (owner_id = auth.uid());
create policy "gyms: owner insert" on gyms for insert with check (owner_id = auth.uid());
create policy "gyms: owner update" on gyms for update using (owner_id = auth.uid());

-- Owners can fully manage their own gym's config.
create policy "gym_config: owner select" on gym_config for select
  using (gym_id in (select id from gyms where owner_id = auth.uid()));
create policy "gym_config: owner insert" on gym_config for insert
  with check (gym_id in (select id from gyms where owner_id = auth.uid()));
create policy "gym_config: owner update" on gym_config for update
  using (gym_id in (select id from gyms where owner_id = auth.uid()));

-- Note: the Stripe webhook writes to `gyms` using the service_role key, which
-- bypasses RLS entirely — that's expected and required (Stripe has no Supabase
-- login session to present).
