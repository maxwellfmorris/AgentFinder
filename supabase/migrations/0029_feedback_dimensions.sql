-- Migration 0029: feedback_dimensions
-- Single table for both AgentFinder core dimensions and developer custom dimensions.
-- agent_id IS NULL  → core dimension, applies to all Workshop agents
-- agent_id NOT NULL → custom dimension scoped to that agent (max 2 per agent enforced in app)

create table feedback_dimensions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  agent_id    uuid references agents(id) on delete cascade,
  label       text not null,
  description text,                        -- optional tooltip / helper text shown to reviewer
  sort_order  integer not null default 0,  -- controls display order (core first, then custom)
  active      boolean not null default true
);

-- Index for fast lookup: all dimensions relevant to a given agent
-- (core rows where agent_id is null, plus custom rows for this agent)
create index feedback_dimensions_agent_idx
  on feedback_dimensions (agent_id);

-- RLS: public read (dimensions need to be visible to unauthenticated reviewers)
alter table feedback_dimensions enable row level security;

create policy "public can read feedback_dimensions"
  on feedback_dimensions for select
  using (true);

-- Only service role can insert/update dimensions (founders manage via SQL for now)

-- ── Core dimension seed ────────────────────────────────────────────────────────
-- agent_id = null → these apply to every Workshop agent

insert into feedback_dimensions (agent_id, label, description, sort_order) values
  (null, 'Onboarding',      'How easy was it to get started?',                          1),
  (null, 'Pricing Clarity', 'How clear and fair is the pricing?',                       2),
  (null, 'UI / UX',         'How intuitive and pleasant is the interface to use?',      3),
  (null, 'Support Quality', 'How helpful and responsive is customer support?',          4),
  (null, 'Value for Money', 'Does the product deliver good value for what you pay?',    5);
