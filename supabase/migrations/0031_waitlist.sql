-- Migration 0031: waitlist
-- Stores email signups from the homepage "get notified when we launch" strip.
-- No public read — owner exports via Supabase dashboard or SQL.

create table waitlist (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email      text not null,
  source     text not null default 'homepage',  -- where the signup came from
  session_id text,                              -- af_sid cookie for dedup / analytics

  -- Prevent duplicate signups from the same email
  unique (email)
);

-- RLS: anyone can insert (anonymous signups), nobody can read via API
alter table waitlist enable row level security;

create policy "public can join waitlist"
  on waitlist for insert
  with check (true);
