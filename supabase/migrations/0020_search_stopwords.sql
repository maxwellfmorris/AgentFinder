-- Migration: 0020_search_stopwords
-- Refines search_agents (from 0019): drops generic search-filler words before
-- matching, so a query like "find me a hotel" reduces to "hotel" instead of
-- also matching agents that merely contain "find" in their use-cases (e.g. WHOOP).
-- The filtered token string is also used for the fuzzy fallback, so filler words
-- can't leak back in there. Pure data/query change — no app redeploy needed.
-- Idempotent: create or replace.

begin;

create or replace function search_agents(q text)
returns setof agents
language plpgsql
stable
as $$
declare
  cleaned text;
  core text;     -- meaningful tokens only, space-joined (used for fuzzy match)
  ts_q tsquery;
begin
  -- keep only letters/numbers/spaces, lowercase
  cleaned := lower(regexp_replace(coalesce(q, ''), '[^a-zA-Z0-9 ]', ' ', 'g'));

  -- tokenize, drop empties and generic search-filler words, then build:
  --   ts_q  = 'word1:* | word2:* ...'   (any-term prefix match)
  --   core  = 'word1 word2 ...'         (for the trigram fuzzy fallback)
  select
    to_tsquery('english', string_agg(tok || ':*', ' | ')),
    string_agg(tok, ' ')
  into ts_q, core
  from (
    select t as tok
    from unnest(regexp_split_to_array(btrim(cleaned), '\s+')) as t
    where t <> ''
      and t <> all (array[
        'find','show','get','give','need','want','looking','look','search',
        'recommend','suggest','help','me','my','a','an','the','for','to','of',
        'some','any','with','that','this','you','can','app','apps','application',
        'tool','tools','agent','agents','ai','software','something','anything',
        'best','top','good','great','nice'
      ])
  ) toks;

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
    (case when ts_q is not null then ts_rank(a.search_vector, ts_q) else 0 end) desc,
    (case when core is not null and core <> ''
          then word_similarity(core, a.name || ' ' || array_to_string(a.keywords, ' '))
          else 0 end) desc,
    a.review_count desc;
end;
$$;

commit;
