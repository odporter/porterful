-- ============================================================
-- LIKENESS™ OFFER SYSTEM — Porterful Supabase Schema
-- Added to existing Porterful schema (porterful-app/supabase/)
-- ============================================================

-- ── OFFERS ─────────────────────────────────────────────────
-- Every sale originates from an offer. Price is server-side only.
create table public.offers (
  id          uuid default gen_random_uuid() primary key,
  offer_id    text unique not null,          -- public ID e.g. OFR-A3F2-K9M1
  lk_id      text not null,                  -- Likeness™ identity (links to profiles.lk_id)
  username   text not null,                  -- display name for the page
  product_id text not null,                  -- Porterful product key
  product_name text not null,
  price_cents integer not null,              -- LOCKED price (read from here, never URL)
  currency   text not null default 'usd',
  status     text not null default 'active'
    check (status in ('active', 'paused', 'sold', 'expired')),
  click_count integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_offers_lk_id   on public.offers(lk_id);
create index idx_offers_status on public.offers(status);

-- ── TRANSACTIONS ─────────────────────────────────────────
-- Every purchase through an offer. Single source of truth.
create table public.offer_transactions (
  id              uuid default gen_random_uuid() primary key,
  offer_id        text not null references public.offers(offer_id),
  lk_id           text not null,                           -- seller identity
  buyer_email     text,
  stripe_session_id text unique not null,
  amount_cents    integer not null,
  currency        text not null default 'usd',
  commission_cents integer not null,                       -- seller's cut (3%)
  product_id      text not null,
  status          text not null default 'pending'
    check (status in ('pending', 'completed', 'refunded')),
  created_at      timestamptz default now()
);
create index idx_tx_offer on public.offer_transactions(offer_id);
create index idx_tx_lk    on public.offer_transactions(lk_id);
create index idx_tx_stripe on public.offer_transactions(stripe_session_id);

-- ── EARNINGS (per-user wallet) ──────────────────────────
create table public.earnings (
  id          uuid default gen_random_uuid() primary key,
  lk_id       text unique not null,
  username    text not null,
  total_earned_cents integer not null default 0,
  pending_cents    integer not null default 0,   -- cleared after Stripe payout
  last_payout_at   timestamptz,
  last_activity_at timestamptz default now(),
  created_at  timestamptz default now()
);
create index idx_earn_lk on public.earnings(lk_id);

-- RLS: users can read their own rows
alter table public.offers enable row level security;
create policy "offer owner can read" on public.offers
  for select using (lk_id = current_setting('request.lk_id', true));
alter table public.offer_transactions enable row level security;
create policy "tx owner can read" on public.offer_transactions
  for select using (lk_id = current_setting('request.lk_id', true));
alter table public.earnings enable row level security;
create policy "earnings owner can read" on public.earnings
  for select using (lk_id = current_setting('request.lk_id', true));

-- ── INTERNAL HELPERS ─────────────────────────────────────
-- Generate a short public offer ID (no secrets — this is just an ID)
create or replace function public.generate_offer_id()
returns text as $$
  select 'OFR-' || upper(substr(gen_random_uuid()::text, 1, 4)) || '-' || upper(substr(gen_random_uuid()::text, 5, 4));
$$ language sql stable;

-- Upsert earnings row on first sale
create or replace function public.upsert_earnings(p_lk_id text, p_username text)
returns public.earnings as $$
  insert into public.earnings (lk_id, username)
  values (p_lk_id, p_username)
  on conflict (lk_id) do update set
    last_activity_at = now()
  returning *;
$$ language sql;

-- ── RPC FUNCTIONS ────────────────────────────────────────
create or replace function public.increment_offer_clicks(offer_id text)
returns void as $$
  update public.offers set click_count = click_count + 1 where offer_id = increment_offer_clicks.offer_id;
$$ language sql security definer;

create or replace function public.add_earnings(p_lk_id text, p_username text, p_cents bigint)
returns void as $$
  insert into public.earnings (lk_id, username, total_earned_cents, pending_cents, last_activity_at)
  values (p_lk_id, p_username, p_cents, p_cents, now())
  on conflict (lk_id) do update set
    total_earned_cents = earnings.total_earned_cents + p_cents,
    pending_cents = earnings.pending_cents + p_cents,
    last_activity_at = now();
$$ language sql security definer;
