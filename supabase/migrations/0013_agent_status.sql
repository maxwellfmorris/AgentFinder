-- Migration: 0013_agent_status
-- Adds a moderation gate. New submissions are 'pending' until approved;
-- only 'published' agents are shown to the public. The existing catalog is
-- backfilled to 'published' so nothing currently live disappears.
-- Idempotent: safe to re-run.

begin;

-- Step 1: add status column, nullable for now (no-op if already present)
alter table agents add column if not exists status text;

-- Step 2: backfill anything already in the catalog to 'published'
update agents set status = 'published' where status is null;

-- Step 3: new submissions default to 'pending'; enforce not-null
alter table agents alter column status set default 'pending';
alter table agents alter column status set not null;

-- Step 4: constrain allowed values (no-op if the constraint already exists)
do $$ begin
  alter table agents
    add constraint agents_status_check check (status in ('pending', 'published', 'rejected'));
exception when duplicate_object then null;
end $$;

commit;
