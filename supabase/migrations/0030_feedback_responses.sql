-- Migration 0030: feedback_responses
-- Stores one row per dimension per review.
-- Submitted alongside the Workshop review form; invisible to public until
-- a developer dashboard surfaces aggregated views.

create table feedback_responses (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  review_id    uuid not null references reviews(id) on delete cascade,
  agent_id     uuid not null references agents(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  dimension_id uuid not null references feedback_dimensions(id) on delete cascade,
  rating       integer not null check (rating between 1 and 5),
  comment      text,                        -- optional free-text per dimension

  -- One response per user per dimension per agent
  unique (agent_id, user_id, dimension_id)
);

-- Fast lookup: all responses for a given agent (for future developer dashboard)
create index feedback_responses_agent_idx
  on feedback_responses (agent_id, created_at desc);

-- Fast lookup: all responses for a given review
create index feedback_responses_review_idx
  on feedback_responses (review_id);

-- RLS
alter table feedback_responses enable row level security;

-- Public read — enables future aggregated developer dashboard without auth requirement
create policy "public can read feedback_responses"
  on feedback_responses for select
  using (true);

-- Authenticated insert — reviewer must be logged in; user_id must match session
create policy "authenticated users can insert own feedback_responses"
  on feedback_responses for insert
  to authenticated
  with check (user_id = auth.uid());
