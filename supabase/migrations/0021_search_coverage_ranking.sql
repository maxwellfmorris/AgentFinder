-- Migration: 0021_search_coverage_ranking
-- Replaces search_agents (from 0020) with a coverage-first ordering so the
-- agent that matches the MOST of your search words ranks first, with a stable
-- name tiebreaker (review_count is 0 everywhere so it can't actually break ties).
-- Behavior is otherwise identical: same stop-word list, same tsquery + fuzzy
-- fallback. Idempotent: create or replace, no schema changes.

begin;

create or replace function search_agents(q text)
returns setof agents
language plpgsql
stable
as $$
declare
  cleaned text;
  toks text[];   -- filtered, meaningful tokens
  ts_q tsquery;
  core text;
begin
  -- keep only letters/numbers/spaces, lowercase
  cleaned := lower(regexp_replace(coalesce(q, ''), '[^a-zA-Z0-9 ]', ' ', 'g'));

  -- meaningful tokens only (drop filler words like 'find', 'show', 'best', 'app'…)
  toks := array(
    select t
    from unnest(regexp_split_to_array(btrim(cleaned), '\s+')) as t
    where t <> ''
      and t <> all (array[
        'find','show','get','give','need','want','looking','look','search',
        'recommend','suggest','help','me','my','a','an','the','for','to','of',
        'some','any','with','that','this','you','can','app','apps','application',
        'tool','tools','agent','agents','ai','software','something','anything',
        'best','top','good','great','nice'
      ])
  );

  -- ts_q = 'word1:* | word2:* …'  ; core = 'word1 word2 …' (for fuzzy)
  select
    to_tsquery('english', string_agg(tk || ':*', ' | ')),
    string_agg(tk, ' ')
  into ts_q, core
  from unnest(toks) tk;

  return query
  select a.*
  from agents a
  where a.status = 'published'
    and (
      (ts_q is not null and a.search_vector @@ ts_q)
      or (core is not null and core <> '' and word_similarity(
            core,
            a.name || ' ' || array_to_string(a.keywords, ' ') || ' ' || coalesce(a.tagline, '')
          ) > 0.4)
    )
  order by
    -- 1. Coverage: distinct query tokens that individually match this agent
    (
      select count(*)::int
      from unnest(toks) tk
      where a.search_vector @@ to_tsquery('english', tk || ':*')
    ) desc,
    -- 2. ts_rank: stronger textual match (term frequency × weight)
    (case when ts_q is not null then ts_rank(a.search_vector, ts_q) else 0 end) desc,
    -- 3. Fuzzy closeness (for typo / near-miss cases)
    (case when core is not null and core <> ''
          then word_similarity(core, a.name || ' ' || array_to_string(a.keywords, ' '))
          else 0 end) desc,
    -- 4. Stable name tiebreak so equal results don't shuffle between searches
    a.name asc;
end;
$$;

commit;
