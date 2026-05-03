-- Migration: 0003_agent_evals
-- Creates the agent_evals table for benchmark performance scores.
-- Idempotent: safe to re-run.

begin;

create table if not exists agent_evals (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  agent_id      uuid        not null references agents(id) on delete cascade,
  benchmark_name text       not null,
  score         numeric(5,2) not null check (score >= 0 and score <= 100),
  sample_size   integer,
  notes         text,
  evaluated_at  timestamptz not null default now(),
  verified_by   text        not null check (verified_by in ('self_reported','agentfinder','third_party'))
);

create index if not exists agent_evals_agent_evaluated
  on agent_evals(agent_id, evaluated_at desc);

alter table agent_evals enable row level security;

drop policy if exists "Evals are readable by everyone" on agent_evals;
create policy "Evals are readable by everyone"
  on agent_evals for select
  using (true);

commit;
