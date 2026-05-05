begin;

alter table agents
  add column if not exists featured_until timestamptz;

alter table agents
  add column if not exists featured_tier text not null default 'none'
    check (featured_tier in ('none','category','homepage'));

-- Partial index over rows that have any active feature tier.
-- Uses featured_tier <> 'none' (a constant predicate) because now() is
-- non-immutable and cannot appear in a partial index predicate in PostgreSQL.
create index if not exists agents_featured
  on agents(featured_until, featured_tier)
  where featured_tier <> 'none';

commit;
