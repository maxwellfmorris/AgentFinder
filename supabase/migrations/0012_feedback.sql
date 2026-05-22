begin;

create table if not exists feedback (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  message     text        not null,
  email       text,
  page_path   text,
  session_id  text        not null,
  user_id     uuid        references auth.users(id) on delete set null
);

create index if not exists feedback_created on feedback(created_at desc);

alter table feedback enable row level security;
drop policy if exists "Anyone can send feedback" on feedback;
create policy "Anyone can send feedback"
  on feedback for insert with check (true);
-- No select policy. Reads happen via Supabase SQL editor (admin context).

commit;
