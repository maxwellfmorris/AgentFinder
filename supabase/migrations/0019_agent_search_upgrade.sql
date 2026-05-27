-- Migration: 0019_agent_search_upgrade
-- Fixes the "useless search" problem (vocabulary mismatch + all-words-required).
--   1. keywords text[] column — curated search terms, folded into the index.
--   2. search_vector maintained by a TRIGGER (not a generated column): the
--      weighted vector now includes keywords + use_cases. A generated column
--      can't use array_to_string (Postgres marks it STABLE, not IMMUTABLE),
--      so a before-insert/update trigger does the work instead.
--   3. pg_trgm extension for fuzzy/typo matching.
--   4. search_agents(q) function: any-term + prefix tsquery match, ranked by
--      ts_rank, with a word_similarity (trigram) fuzzy fallback. No LLM.
--   5. keywords seeded for all 18 agents; search_vector backfilled.
-- Idempotent: re-running drops/recreates the column, trigger, and function.

begin;

-- 1. Curated, search-only keywords (not displayed in the UI)
alter table agents add column if not exists keywords text[] not null default '{}';

-- 2. Fuzzy-match extension (provides word_similarity)
create extension if not exists pg_trgm;

-- 3. Replace the old generated search_vector with a trigger-maintained column
drop index if exists agents_search_vector;
alter table agents drop column if exists search_vector;
alter table agents add column search_vector tsvector;

create or replace function agents_search_vector_update()
returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('english', array_to_string(new.keywords, ' ')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.tagline, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(new.use_cases, ' ')), 'C') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'D');
  return new;
end;
$$;

drop trigger if exists agents_search_vector_trg on agents;
create trigger agents_search_vector_trg
  before insert or update on agents
  for each row execute function agents_search_vector_update();

create index agents_search_vector on agents using gin(search_vector);

-- 4. Relevance-ranked search with a fuzzy fallback
create or replace function search_agents(q text)
returns setof agents
language plpgsql
stable
as $$
declare
  cleaned text;
  ts_q tsquery;
begin
  -- keep only letters/numbers/spaces, lowercase
  cleaned := lower(regexp_replace(coalesce(q, ''), '[^a-zA-Z0-9 ]', ' ', 'g'));

  -- build an OR-of-prefixes tsquery, e.g. 'run:* | faster:*'
  select to_tsquery('english', string_agg(tok || ':*', ' | '))
    into ts_q
  from (
    select t as tok
    from unnest(regexp_split_to_array(btrim(cleaned), '\s+')) as t
    where t <> ''
  ) toks;

  return query
  select a.*
  from agents a
  where a.status = 'published'
    and (
      (ts_q is not null and a.search_vector @@ ts_q)
      or word_similarity(
           cleaned,
           a.name || ' ' || array_to_string(a.keywords, ' ') || ' ' || coalesce(a.tagline, '')
         ) > 0.4
    )
  order by
    (case when ts_q is not null then ts_rank(a.search_vector, ts_q) else 0 end) desc,
    word_similarity(cleaned, a.name || ' ' || array_to_string(a.keywords, ' ')) desc,
    a.review_count desc;
end;
$$;

grant execute on function search_agents(text) to anon, authenticated;

-- 5. Seed curated keywords (each UPDATE fires the trigger → recomputes search_vector)
update agents set keywords = ARRAY['grammar','spelling','punctuation','proofread','writing assistant','tone','rewrite','email','essay','typos','clarity','editing'] where slug = 'grammarly';
update agents set keywords = ARRAY['rewrite','rephrase','paraphrase','reword','summarize','synonyms','fluency','sentences','tone','clarity'] where slug = 'wordtune';
update agents set keywords = ARRAY['tutor','homework help','math','algebra','calculus','science','study','learn','teacher','student','test prep','education'] where slug = 'khanmigo';
update agents set keywords = ARRAY['language','Spanish','French','German','Italian','Japanese','Chinese','Korean','vocabulary','learn a language','fluency','lessons'] where slug = 'duolingo';
update agents set keywords = ARRAY['budget','budgeting','spending','save money','savings','expenses','finances','paycheck','debt','track spending'] where slug = 'cleo';
update agents set keywords = ARRAY['budget','net worth','spending tracker','transactions','accounts','investments','personal finance','money management'] where slug = 'copilot-money';
update agents set keywords = ARRAY['family calendar','household','schedule','reminders','parenting','kids','school','logistics','to-do','assistant'] where slug = 'ohai-ai';
update agents set keywords = ARRAY['recipes','meal planning','grocery list','cooking','dinner ideas','what to cook','weekly meals','food'] where slug = 'samsung-food';
update agents set keywords = ARRAY['mental health','anxiety','stress','depression','mood','therapy','CBT','wellbeing','feelings','emotional support'] where slug = 'wysa';
update agents set keywords = ARRAY['symptoms','symptom checker','sick','illness','health','medical','doctor','conditions'] where slug = 'ada-health';
update agents set keywords = ARRAY['fitness','running','run faster','workout','exercise','training','recovery','sleep','heart rate','strain','athlete','endurance'] where slug = 'whoop';
update agents set keywords = ARRAY['meditation','meditate','mindfulness','sleep','stress','anxiety','calm','relax','breathing','focus'] where slug = 'headspace';
update agents set keywords = ARRAY['image generator','AI art','generate images','illustration','design','text to image','artwork','pictures'] where slug = 'midjourney';
update agents set keywords = ARRAY['music','song','make music','AI music','generate song','lyrics','beats','audio','track'] where slug = 'suno';
update agents set keywords = ARRAY['trip planner','itinerary','travel planning','vacation','plan a trip','destinations','things to do'] where slug = 'mindtrip';
update agents set keywords = ARRAY['flights','cheap flights','flight deals','airfare','hotels','price tracker','when to fly','travel deals'] where slug = 'hopper';
update agents set keywords = ARRAY['travel assistant','travel tips','itinerary','restaurants','recommendations','things to do'] where slug = 'guidegeek';
update agents set keywords = ARRAY['trip planner','travel itinerary','plan a trip','road trip','group travel','maps','bookings','vacation planning'] where slug = 'wanderlog';

-- Backfill every row (incl. any non-published) so all have a current search_vector
update agents set keywords = keywords;

commit;
