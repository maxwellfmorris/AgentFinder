begin;

create table if not exists search_events (
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

create index if not exists search_events_session on search_events(session_id, created_at desc);
create index if not exists search_events_query on search_events(query, created_at desc);

alter table search_events enable row level security;
drop policy if exists "Anyone can log a search event" on search_events;
create policy "Anyone can log a search event"
  on search_events for insert with check (true);
-- No select policy. Reads happen via Supabase SQL editor (admin context).

commit;
