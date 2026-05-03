-- Migration: 0000_reviews_table
--
-- Creates the `reviews` table referenced by the application code
-- (src/components/ReviewForm.tsx, src/components/ReviewsList.tsx,
-- src/types/database.ts). The table was originally created ad-hoc in the
-- Supabase dashboard, which means a fresh clone running schema.sql alone
-- could not bootstrap the project. This migration captures the definition
-- so the bootstrap path is `schema.sql` -> `migrations/0000_*` -> `0001_*`.
--
-- Numbered 0000 so it runs before 0001_review_rating_trigger.sql, which
-- creates a trigger ON this table.
--
-- Fully idempotent: safe to apply against environments where the table
-- already exists.

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  agent_id uuid not null references agents(id) on delete cascade,
  user_id  uuid not null references auth.users(id) on delete cascade,
  user_email text not null,

  rating integer not null check (rating between 1 and 5),
  body   text    not null,

  -- One review per (agent, user) — the application code in
  -- ReviewForm.tsx relies on Postgres error code 23505 to surface
  -- the "You have already reviewed this agent" message.
  unique (agent_id, user_id)
);

-- Read patterns: list reviews for an agent, ordered most-recent-first.
create index if not exists reviews_agent_id   on reviews(agent_id);
create index if not exists reviews_created_at on reviews(created_at desc);

-- Row-level security: public read, authenticated self-write.
-- If your dashboard table has different policies, reconcile before applying.
alter table reviews enable row level security;

drop policy if exists "Reviews are readable by everyone" on reviews;
create policy "Reviews are readable by everyone"
  on reviews for select
  using (true);

drop policy if exists "Users can insert their own reviews" on reviews;
create policy "Users can insert their own reviews"
  on reviews for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own reviews" on reviews;
create policy "Users can update their own reviews"
  on reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own reviews" on reviews;
create policy "Users can delete their own reviews"
  on reviews for delete
  using (auth.uid() = user_id);
