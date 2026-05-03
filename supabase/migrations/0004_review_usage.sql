-- Migration: 0004_review_usage
-- Adds usage_claim and months_used to the reviews table.
-- Idempotent: safe to re-run.

begin;

alter table reviews
  add column if not exists usage_claim text not null default 'none'
    check (usage_claim in ('paying','free_trial','evaluating','none'));

alter table reviews
  add column if not exists months_used integer
    check (months_used is null or months_used >= 0);

commit;
