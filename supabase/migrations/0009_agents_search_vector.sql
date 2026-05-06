begin;

alter table agents
  add column if not exists search_vector tsvector
    generated always as (
      to_tsvector('english',
        coalesce(name, '') || ' ' ||
        coalesce(tagline, '') || ' ' ||
        coalesce(description, '')
      )
    ) stored;

create index if not exists agents_search_vector on agents using gin(search_vector);

-- Old functional index is now redundant
drop index if exists agents_name_search;

commit;
