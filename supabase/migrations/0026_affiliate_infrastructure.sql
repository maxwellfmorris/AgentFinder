-- Migration: 0026_affiliate_infrastructure
-- Phase 3a: the revenue plumbing.
--   1. agents.affiliate_url (nullable) — when set, outbound "Visit Website"
--      CTAs route through this URL instead of agents.website. NULL means the
--      agent has no affiliate program or we haven't set one up yet.
--   2. outbound_clicks table — fire-and-forget click log so we can see which
--      agents drive traffic and which affiliate links convert. Public-insert
--      (clients can log a click) + public-select (owner dashboards later).
-- The actual affiliate URLs are populated business-side; this migration just
-- ships the schema.
-- Idempotent.

begin;

alter table agents add column if not exists affiliate_url text;

create table if not exists outbound_clicks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  agent_id uuid not null references agents(id) on delete cascade,
  source text not null check (source in ('card', 'detail', 'compare')),
  was_affiliate boolean not null default false,
  session_id text,
  user_id uuid references auth.users(id) on delete set null
);

alter table outbound_clicks enable row level security;

drop policy if exists "Anyone can log outbound clicks" on outbound_clicks;
create policy "Anyone can log outbound clicks" on outbound_clicks
  for insert
  to public
  with check (true);

drop policy if exists "Anyone can read outbound clicks" on outbound_clicks;
create policy "Anyone can read outbound clicks" on outbound_clicks
  for select
  to public
  using (true);

-- Owner-dashboard queries will scan by (agent_id, created_at desc)
create index if not exists outbound_clicks_agent_created on outbound_clicks(agent_id, created_at desc);

commit;
