-- Migration: 0005_agent_owner
-- Adds submitted_by_user_id to agents so owners can see their own listings.
-- Idempotent: safe to re-run.

begin;

alter table agents
  add column if not exists submitted_by_user_id uuid references auth.users(id) on delete set null;

create index if not exists agents_submitted_by on agents(submitted_by_user_id);

commit;
