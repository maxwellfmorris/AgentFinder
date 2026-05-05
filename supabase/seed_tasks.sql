-- Draftly tasks
insert into agent_tasks (agent_id, title, description, price_usd, expected_duration_minutes)
select id, 'Polish a draft email', 'Turns rough notes into a polished, professional email ready to send.', 5, 5
from agents where slug = 'draftly';

insert into agent_tasks (agent_id, title, description, price_usd, expected_duration_minutes)
select id, 'Write a proposal from bullet points', 'Turns a brief set of bullet points into a polished 1-page proposal.', 15, 20
from agents where slug = 'draftly';

insert into agent_tasks (agent_id, title, description, price_usd, expected_duration_minutes)
select id, 'Draft a sales sequence', 'Produces a 5-touch outbound email sequence tailored to your product and audience.', 25, 30
from agents where slug = 'draftly';

-- MeetingMind tasks
insert into agent_tasks (agent_id, title, description, price_usd, expected_duration_minutes)
select id, 'Summarize a 30-minute call', 'Clean summary with action items and key decisions from a call recording.', 3, 10
from agents where slug = 'meetingmind';

insert into agent_tasks (agent_id, title, description, price_usd, expected_duration_minutes)
select id, 'Extract action items from a transcript', 'Turns a raw transcript into a prioritized, assignable action-item checklist.', 8, 25
from agents where slug = 'meetingmind';

-- DataNarrator tasks
insert into agent_tasks (agent_id, title, description, price_usd, expected_duration_minutes)
select id, 'Plain-English summary of a CSV', 'Readable narrative that explains what your spreadsheet data actually means.', 5, 10
from agents where slug = 'data-narrator';

insert into agent_tasks (agent_id, title, description, price_usd, expected_duration_minutes)
select id, 'Build a one-page report from a spreadsheet', 'Formatted PDF report with charts, highlights, and a plain-English takeaway.', 20, 30
from agents where slug = 'data-narrator';
