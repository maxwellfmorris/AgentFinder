begin;

create table if not exists agent_tasks (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  agent_id    uuid        not null references agents(id) on delete cascade,
  title       text        not null,
  description text        not null,
  price_usd   numeric(10,2) not null check (price_usd >= 0),
  expected_duration_minutes integer check (expected_duration_minutes is null or expected_duration_minutes > 0),
  available   boolean     not null default true
);

create index if not exists agent_tasks_agent
  on agent_tasks(agent_id) where available = true;

alter table agent_tasks enable row level security;
drop policy if exists "Tasks are readable by everyone" on agent_tasks;
create policy "Tasks are readable by everyone"
  on agent_tasks for select using (true);

commit;
