-- AgentFinder schema
-- Run this in your Supabase SQL editor to create the agents table

drop table if exists agents;
drop type if exists pricing_model;
drop type if exists setup_complexity;

create type pricing_model as enum ('free', 'freemium', 'subscription', 'usage_based', 'enterprise');
create type setup_complexity as enum ('plug_and_play', 'low', 'medium', 'high');

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
  verified boolean not null default false,

  -- Social proof
  average_rating numeric(3,2) default null check (average_rating >= 0 and average_rating <= 5),
  review_count integer not null default 0
);

-- Full-text search index
create index agents_name_search on agents using gin(to_tsvector('english', name || ' ' || tagline || ' ' || description));
-- Fast filter indexes
create index agents_category on agents(category);
create index agents_pricing on agents(pricing_model);
