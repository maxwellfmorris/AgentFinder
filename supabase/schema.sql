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
  submitted_by_user_id uuid references auth.users(id) on delete set null
);

-- Full-text search index
create index agents_name_search on agents using gin(to_tsvector('english', name || ' ' || tagline || ' ' || description));
-- Fast filter indexes
create index agents_category on agents(category);
create index agents_pricing on agents(pricing_model);
create index agents_submitted_by on agents(submitted_by_user_id);

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
