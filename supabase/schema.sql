-- AgentFinder schema
-- Run this in your Supabase SQL editor to create the agents table

drop table if exists agent_evals;
drop table if exists agents;
drop type if exists pricing_model;
drop type if exists setup_complexity;
drop type if exists trust_tier;

create type pricing_model as enum ('free', 'freemium', 'subscription', 'usage_based', 'enterprise');
create type setup_complexity as enum ('plug_and_play', 'low', 'medium', 'high');
create type trust_tier as enum ('listed', 'verified', 'vetted', 'audited');

create table agents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  -- Identity
  name text not null,
  slug text not null unique,
  tagline text not null,
  description text not null,
  website text,
  logo_url text,

  -- Discovery
  category text not null,
  industry_tags text[] default '{}',
  platform_integrations text[] default '{}',

  -- Buyer decision signals
  pricing_model pricing_model not null default 'freemium',
  setup_complexity setup_complexity not null default 'low',
  trust_tier trust_tier not null default 'listed',

  -- Social proof
  average_rating numeric(3,2) default null check (average_rating >= 0 and average_rating <= 5),
  review_count integer not null default 0,

  -- Ownership
  submitted_by_user_id uuid references auth.users(id) on delete set null,

  -- Featured placement (flat-fee, time-boxed)
  featured_until timestamptz,
  featured_tier text not null default 'none'
    check (featured_tier in ('none','category','homepage')),

  -- Full-text search (generated, immutable)
  search_vector tsvector generated always as (
    to_tsvector('english',
      coalesce(name, '') || ' ' ||
      coalesce(tagline, '') || ' ' ||
      coalesce(description, '')
    )
  ) stored
);

-- Full-text search GIN index
create index agents_search_vector on agents using gin(search_vector);
-- Fast filter indexes
create index agents_category on agents(category);
create index agents_pricing on agents(pricing_model);
create index agents_submitted_by on agents(submitted_by_user_id);
create index agents_featured on agents(featured_until, featured_tier) where featured_tier <> 'none';

create table agent_evals (
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

create index agent_evals_agent_evaluated
  on agent_evals(agent_id, evaluated_at desc);

alter table agent_evals enable row level security;
create policy "Evals are readable by everyone"
  on agent_evals for select
  using (true);

create table agent_tasks (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  agent_id    uuid        not null references agents(id) on delete cascade,
  title       text        not null,
  description text        not null,
  price_usd   numeric(10,2) not null check (price_usd >= 0),
  expected_duration_minutes integer check (expected_duration_minutes is null or expected_duration_minutes > 0),
  available   boolean     not null default true
);

create index agent_tasks_agent
  on agent_tasks(agent_id) where available = true;

alter table agent_tasks enable row level security;
create policy "Tasks are readable by everyone"
  on agent_tasks for select using (true);

create table search_events (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  event_type   text        not null check (event_type in ('search','click')),
  session_id   text        not null,
  user_id      uuid        references auth.users(id) on delete set null,
  query        text        not null,
  result_count integer,
  agent_id     uuid        references agents(id) on delete cascade,
  position     integer
);

create index search_events_session on search_events(session_id, created_at desc);
create index search_events_query on search_events(query, created_at desc);

alter table search_events enable row level security;
create policy "Anyone can log a search event"
  on search_events for insert with check (true);
-- No select policy. Reads happen via Supabase SQL editor (admin context).
