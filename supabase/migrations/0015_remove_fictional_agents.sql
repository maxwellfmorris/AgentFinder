-- Migration: 0015_remove_fictional_agents
-- Removes the original fictional seed agents now that real agents are live.
-- Every fictional agent used a placeholder https://example.com/... website,
-- which cleanly distinguishes them from the real, externally-hosted agents.
-- Foreign-key cascades remove their fabricated reviews/evals/tasks/search_events.

begin;

delete from agents where website like 'https://example.com/%';

commit;
