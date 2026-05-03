-- Migration: 0001_review_rating_trigger
-- Recomputes agents.average_rating and agents.review_count whenever a review
-- is inserted, updated, or deleted. Safe to re-run (idempotent).

-- Drop old INSERT-only trigger from initial setup if it exists
drop trigger if exists on_review_inserted on reviews;

-- Function handles INSERT, UPDATE, DELETE via TG_OP
create or replace function update_agent_rating()
returns trigger as $$
declare
  affected_agent_id uuid;
begin
  -- For DELETE use OLD; for INSERT/UPDATE use NEW
  if tg_op = 'DELETE' then
    affected_agent_id := old.agent_id;
  else
    affected_agent_id := new.agent_id;
  end if;

  update agents
  set
    average_rating = (
      select
        case when count(*) = 0 then null
             else round(avg(rating)::numeric, 2)
        end
      from reviews
      where agent_id = affected_agent_id
    ),
    review_count = (
      select count(*)
      from reviews
      where agent_id = affected_agent_id
    )
  where id = affected_agent_id;

  return coalesce(new, old);
end;
$$ language plpgsql;

-- Drop and recreate so re-running this file is safe
drop trigger if exists on_review_change on reviews;

create trigger on_review_change
  after insert or update or delete on reviews
  for each row execute function update_agent_rating();
