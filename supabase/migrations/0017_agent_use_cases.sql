-- Migration: 0017_agent_use_cases
-- Repurposes the old "Quick Tasks" idea into honest, payment-free "Good for"
-- use-cases. Adds a use_cases text[] column to agents (defaults to empty), and
-- seeds ONE agent (Grammarly) so the new "Good for" section can be previewed
-- before writing use-cases for the rest of the catalog.
-- Idempotent: add column if not exists + slug-scoped update.

begin;

alter table agents add column if not exists use_cases text[] not null default '{}';

update agents
set use_cases = ARRAY[
  'Fix grammar and spelling as you type',
  'Make an email sound more confident',
  'Shorten a wordy paragraph without losing the point',
  'Draft a first version from a quick prompt'
]
where slug = 'grammarly';

commit;
