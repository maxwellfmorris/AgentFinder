-- Migration: 0002_trust_tier
-- Replaces the boolean `verified` column with a four-tier trust_tier enum.
-- Idempotent: safe to re-run on databases that already have trust_tier.

begin;

-- Step 1: create enum type (no-op if already exists)
do $$ begin
  create type trust_tier as enum ('listed', 'verified', 'vetted', 'audited');
exception when duplicate_object then null;
end $$;

-- Step 2: add column with default 'listed' (no-op if already present)
alter table agents
  add column if not exists trust_tier trust_tier not null default 'listed';

-- Step 3: backfill and drop verified only if the old column still exists
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'agents'
      and column_name  = 'verified'
  ) then
    update agents
    set trust_tier = case
      when verified = true  then 'verified'::trust_tier
      else                       'listed'::trust_tier
    end;
    -- Drop any policies that reference the verified column before dropping it
    drop policy if exists "Anyone can submit an agent" on agents;
    alter table agents drop column verified;
  end if;
end $$;

commit;
