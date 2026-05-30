-- Migration: 0024_agent_limitations
-- Adds a limitations text[] column to agents and seeds honest "Things to know"
-- caveats for all 18 agents. This is an editorial layer (not founder-submitted)
-- that helps users know what to expect before signing up — free-tier gating,
-- regional availability, hardware requirements, and scope-of-the-tool things.
-- Idempotent: add column if not exists + slug-scoped UPDATEs.

begin;

alter table agents add column if not exists limitations text[] not null default '{}';

update agents set limitations = ARRAY[
  'Advanced tone, clarity, and rewrite features need Premium',
  'The free tier covers basic grammar and spelling only',
  'Best on English; other languages have lighter coverage'
] where slug = 'grammarly';

update agents set limitations = ARRAY[
  'Free tier limits how many rewrites per day',
  'Premium unlocks longer summaries and unlimited rewrites',
  'Best on English; other language support is thinner'
] where slug = 'wordtune';

update agents set limitations = ARRAY[
  'Free for K-12 teachers; learners and parents pay (~$4/month)',
  'The tutor guides toward the answer rather than handing it over — by design',
  'Only available inside a Khan Academy account'
] where slug = 'khanmigo';

update agents set limitations = ARRAY[
  'Free tier has ads between lessons',
  'AI roleplay and mistake explanations are part of Duolingo Max (paid)',
  'Less-common languages have shorter course trees'
] where slug = 'duolingo';

update agents set limitations = ARRAY[
  'Cash advances and savings tools are part of paid Cleo Plus',
  'Bank linking is only available in the US, UK, and Canada',
  'The "sassy" chat tone isn''t for everyone'
] where slug = 'cleo';

update agents set limitations = ARRAY[
  'Subscription-only — no free tier beyond a 30-day trial',
  'Strongest on iPhone and Mac; the web app is newer',
  'Some smaller banks aren''t supported yet (depends on the aggregator)'
] where slug = 'copilot-money';

update agents set limitations = ARRAY[
  'Subscription required after a short trial',
  'Most useful when the whole household is on board (calendars synced)',
  'Best with iOS and Apple Calendar; Android coverage is lighter'
] where slug = 'ohai-ai';

update agents set limitations = ARRAY[
  'AI weekly meal plans need a paid subscription',
  'Some grocery delivery integrations only work in select regions',
  'Recipe imports occasionally miss ingredient details'
] where slug = 'samsung-food';

update agents set limitations = ARRAY[
  'Not a replacement for therapy or crisis care',
  'Human coach access is part of the paid plan',
  'AI chat can feel repetitive over longer use'
] where slug = 'wysa';

update agents set limitations = ARRAY[
  'A triage tool, not a diagnosis — always confirm with a doctor for serious symptoms',
  'Skews toward common conditions; rarer issues may not surface',
  'Children under 1 aren''t fully supported'
] where slug = 'ada-health';

update agents set limitations = ARRAY[
  'Requires the WHOOP band — there''s no free or screen-based version',
  'Monthly subscription on top of the band',
  'No GPS or step count — recovery/strain-focused, not a smartwatch'
] where slug = 'whoop';

update agents set limitations = ARRAY[
  'Mostly subscription-only after the trial; little free content',
  'Ebb (the AI companion) is part of the paid plan',
  'Best for guided practice; less open-ended than meditation timer apps'
] where slug = 'headspace';

update agents set limitations = ARRAY[
  'Subscription-only — no free tier',
  'Used through the web app or Discord; no standalone mobile app',
  'Commercial usage rights depend on your subscription tier'
] where slug = 'midjourney';

update agents set limitations = ARRAY[
  'Free tier limits songs per day and reserves commercial rights',
  'Output quality varies by genre — some styles work better than others',
  'Can''t generate copyrighted artist styles or voices'
] where slug = 'suno';

update agents set limitations = ARRAY[
  'Best on web and iOS; Android app is newer',
  'Real-time pricing depends on third-party booking integrations',
  'Free tier covers most planning; some features behind Pro'
] where slug = 'mindtrip';

update agents set limitations = ARRAY[
  'Strongest on flights; hotel inventory is thinner',
  'Optional paid extras (like Price Freeze) can add hidden costs',
  'Customer service has mixed reviews when bookings need changes'
] where slug = 'hopper';

update agents set limitations = ARRAY[
  'Lives inside WhatsApp, Instagram, or Messenger — no app of its own',
  'Conversational; works best for quick questions, less for deep planning',
  'Free, but uses a third-party messaging account you already have'
] where slug = 'guidegeek';

update agents set limitations = ARRAY[
  'Free tier covers core planning; PDF export and advanced features need Pro',
  'Real-time collaboration can lag on slow connections',
  'Some users find the in-app upgrade prompts aggressive'
] where slug = 'wanderlog';

commit;
