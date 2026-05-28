-- Migration: 0022_external_ratings
-- Schema-only foundation for Week 2's "real, sourced ratings" UI: adds four
-- nullable columns that will hold honest external ratings (App Store / Google
-- Play / Trustpilot / G2) with a verifiable source link. No data yet; Week 2
-- will research and seed per agent. Agents without a public rating stay NULL
-- (no fabrication).

begin;

alter table agents add column if not exists external_rating numeric(2,1);
alter table agents add column if not exists external_rating_count integer;
alter table agents add column if not exists external_rating_source text;
alter table agents add column if not exists external_rating_url text;

commit;
