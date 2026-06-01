-- Migration: 0027_workshop_foundation
-- Workshop Phase W1: the opt-in "credits-for-honest-feedback" program for
-- indie consumer-AI agents. Schema only — no flow yet; W2 adds the user
-- review flow and W3 documents the founder-side workflow.
--   1. agents.workshop_* columns — campaign configuration.
--   2. reviews.incentivized boolean — flags reviews submitted via Workshop.
--   3. workshop_credit_codes table — the codes pool that the developer pre-
--      uploads. Each row is one unique redemption code. RLS lets a user read
--      only the codes they personally claimed; inserts/updates happen
--      server-side via service-role (the founder workflow in W3).
-- Idempotent.

begin;

-- 1. Workshop campaign configuration on agents
alter table agents add column if not exists workshop_active boolean not null default false;
alter table agents add column if not exists workshop_credit_amount numeric(8,2);
alter table agents add column if not exists workshop_credit_type text;            -- e.g. '$5', '1 month free'
alter table agents add column if not exists workshop_credit_redemption_url text;
alter table agents add column if not exists workshop_credit_redemption_instructions text;
alter table agents add column if not exists workshop_target_reviews integer;
alter table agents add column if not exists workshop_reviews_remaining integer;
alter table agents add column if not exists workshop_started_at timestamptz;
alter table agents add column if not exists workshop_paused boolean not null default false;

-- 2. Mark reviews submitted via the Workshop program
alter table reviews add column if not exists incentivized boolean not null default false;

-- 3. Codes pool — one row per redemption code uploaded by the developer
create table if not exists workshop_credit_codes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  agent_id uuid not null references agents(id) on delete cascade,
  code text not null,
  claimed_by_user_id uuid references auth.users(id) on delete set null,
  claimed_at timestamptz,
  unique(agent_id, code)
);

alter table workshop_credit_codes enable row level security;

-- Authenticated users can read codes they've personally claimed (so the
-- post-approval surface in W2 can show them their code). All other access
-- happens server-side via the service role, which bypasses RLS.
drop policy if exists "Users can read their own claimed codes" on workshop_credit_codes;
create policy "Users can read their own claimed codes" on workshop_credit_codes
  for select to authenticated
  using (claimed_by_user_id = auth.uid());

-- Fast unclaimed-codes-by-agent lookup for the allocation step in W2
create index if not exists workshop_credit_codes_agent_unclaimed
  on workshop_credit_codes(agent_id)
  where claimed_by_user_id is null;

commit;
