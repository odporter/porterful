-- Porterful Supabase Schema
-- Run in Supabase SQL Editor

-- ── LEADS TABLE ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.porterful_leads (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT DEFAULT '',
  source      TEXT DEFAULT 'homepage',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.porterful_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads"
  ON public.porterful_leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read lead count"
  ON public.porterful_leads FOR SELECT
  USING (true);
