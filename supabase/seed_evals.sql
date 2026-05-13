-- AgentFinder eval seed data
-- Run after seed.sql. References agents by slug for portability.
-- Grade coverage: A=92, B=87/88, C=76, D=63, F=54

insert into agent_evals (agent_id, benchmark_name, score, sample_size, notes, evaluated_at, verified_by)
select id, 'TaskCompletion-v1', 87.00, 250, null, now(), 'third_party'
from agents where slug = 'draftly';

insert into agent_evals (agent_id, benchmark_name, score, sample_size, notes, evaluated_at, verified_by)
select id, 'Hallucination-Resistance-v2', 92.00, 180, 'Tested against a held-out set of 180 business email prompts with factual constraints. Zero critical hallucinations observed.', now(), 'agentfinder'
from agents where slug = 'draftly';

insert into agent_evals (agent_id, benchmark_name, score, sample_size, notes, evaluated_at, verified_by)
select id, 'Transcription-WER', 88.00, 500, null, now(), 'third_party'
from agents where slug = 'meetingmind';

insert into agent_evals (agent_id, benchmark_name, score, sample_size, notes, evaluated_at, verified_by)
select id, 'Summary-Faithfulness', 63.00, 120, null, now(), 'self_reported'
from agents where slug = 'meetingmind';

insert into agent_evals (agent_id, benchmark_name, score, sample_size, notes, evaluated_at, verified_by)
select id, 'SQL-Accuracy-v3', 76.00, 300, null, now(), 'agentfinder'
from agents where slug = 'data-narrator';

