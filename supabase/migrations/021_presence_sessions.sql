-- 021_presence_sessions.sql
-- Tracks active signed-in users so the dashboard can show who is currently on Porterful.

create table if not exists public.presence_sessions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  username text,
  avatar_url text,
  role text default 'supporter' check (role in ('supporter', 'superfan', 'artist', 'business', 'brand', 'admin')),
  current_path text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_presence_sessions_last_seen_at
  on public.presence_sessions (last_seen_at desc);

create index if not exists idx_presence_sessions_role
  on public.presence_sessions (role);

create index if not exists idx_presence_sessions_current_path
  on public.presence_sessions (current_path);

alter table public.presence_sessions enable row level security;
