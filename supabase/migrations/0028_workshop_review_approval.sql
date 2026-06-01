-- Migration: 0028_workshop_review_approval
-- Workshop Phase W2: review submission flow.
--   1. reviews.approved (boolean, not null, default true) — existing reviews
--      auto-true via the default so nothing already public disappears. New
--      Workshop submissions explicitly insert approved=false and wait in
--      pending state until the founder approves them (W3 workflow).
--   2. reviews.usage_proof (text) and reviews.usage_proof_url (text) — captured
--      from Workshop submissions to help the founder verify the review is real
--      before allocating a code from the pool.
-- ReviewsList already filters by approved=true (added in W2 UI), so pending
-- reviews never leak to the public catalog.
-- Idempotent.

begin;

alter table reviews add column if not exists approved boolean not null default true;
alter table reviews add column if not exists usage_proof text;
alter table reviews add column if not exists usage_proof_url text;

commit;
