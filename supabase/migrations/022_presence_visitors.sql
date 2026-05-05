-- 022_presence_visitors.sql
-- Tracks anonymous visitors so the dashboard can show everyone currently on Porterful.

create table if not exists public.presence_visitors (
  visitor_id text primary key,
  display_name text not null,
  current_path text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_presence_visitors_last_seen_at
  on public.presence_visitors (last_seen_at desc);

create index if not exists idx_presence_visitors_current_path
  on public.presence_visitors (current_path);

alter table public.presence_visitors enable row level security;
