-- Migration: 0023_external_ratings_seed
-- Seeds honest, sourced external ratings for 15 of the 18 agents (the ones with
-- a verifiable public source: Apple App Store, Google Play, or Chrome Web Store).
-- Three agents intentionally stay NULL because no representative public source exists:
--   - Khanmigo:  lives inside the Khan Academy app, no standalone rating.
--   - Midjourney: only public source (Trustpilot, 1.5) reflects billing/CS disputes,
--                 not product quality. Showing it would mislead.
--   - GuideGeek: runs inside WhatsApp/Instagram/Messenger; no app store presence.
-- For 7 agents the star rating is verifiable via the source URL but the precise
-- ratings count was not retrievable in research; external_rating_count is left
-- NULL so the UI simply omits the count line.
-- Idempotent: slug-scoped UPDATEs; re-running overwrites with the same values.

begin;

update agents set
  external_rating = 4.6,
  external_rating_count = 181200,
  external_rating_source = 'App Store',
  external_rating_url = 'https://apps.apple.com/us/app/grammarly-ai-keyboard-notes/id1158877342'
where slug = 'grammarly';

update agents set
  external_rating = 4.9,
  external_rating_count = null,
  external_rating_source = 'Chrome Web Store',
  external_rating_url = 'https://chromewebstore.google.com/detail/wordtune-ai-paraphrasing/nllcnknpjnininklegdoijpljgdjkijc'
where slug = 'wordtune';

-- (no row for khanmigo — see header)

update agents set
  external_rating = 4.7,
  external_rating_count = 4100000,
  external_rating_source = 'App Store',
  external_rating_url = 'https://apps.apple.com/us/app/duolingo-language-lessons/id570060128'
where slug = 'duolingo';

update agents set
  external_rating = 4.6,
  external_rating_count = 70000,
  external_rating_source = 'App Store',
  external_rating_url = 'https://apps.apple.com/us/app/cleo-ai-cash-advance-budget/id1447274646'
where slug = 'cleo';

update agents set
  external_rating = 4.8,
  external_rating_count = 27600,
  external_rating_source = 'App Store',
  external_rating_url = 'https://apps.apple.com/us/app/copilot-track-budget-money/id1447330651'
where slug = 'copilot-money';

update agents set
  external_rating = 4.1,
  external_rating_count = 60,
  external_rating_source = 'App Store',
  external_rating_url = 'https://apps.apple.com/us/app/ohai-ai-household-assistant/id6477802468'
where slug = 'ohai-ai';

update agents set
  external_rating = 4.8,
  external_rating_count = null,
  external_rating_source = 'App Store',
  external_rating_url = 'https://apps.apple.com/us/app/samsung-food-meal-planner/id1133637674'
where slug = 'samsung-food';

update agents set
  external_rating = 4.9,
  external_rating_count = 21700,
  external_rating_source = 'App Store',
  external_rating_url = 'https://apps.apple.com/us/app/wysa-mental-wellbeing-ai/id1166585565'
where slug = 'wysa';

update agents set
  external_rating = 4.8,
  external_rating_count = null,
  external_rating_source = 'App Store',
  external_rating_url = 'https://apps.apple.com/us/app/ada-your-health-portal/id1099986434'
where slug = 'ada-health';

update agents set
  external_rating = 4.8,
  external_rating_count = null,
  external_rating_source = 'App Store',
  external_rating_url = 'https://apps.apple.com/us/app/whoop-performance-optimization/id933944389'
where slug = 'whoop';

update agents set
  external_rating = 4.8,
  external_rating_count = 1000000,
  external_rating_source = 'App Store',
  external_rating_url = 'https://apps.apple.com/us/app/headspace-sleep-meditation/id493145008'
where slug = 'headspace';

-- (no row for midjourney — see header)

update agents set
  external_rating = 4.8,
  external_rating_count = 1500000,
  external_rating_source = 'Google Play',
  external_rating_url = 'https://play.google.com/store/apps/details?id=com.suno.android'
where slug = 'suno';

update agents set
  external_rating = 4.9,
  external_rating_count = null,
  external_rating_source = 'App Store',
  external_rating_url = 'https://apps.apple.com/us/app/mindtrip-ai-travel-companion/id6503107567'
where slug = 'mindtrip';

update agents set
  external_rating = 4.7,
  external_rating_count = null,
  external_rating_source = 'App Store',
  external_rating_url = 'https://apps.apple.com/us/app/hopper-flights-hotels-cars/id904052407'
where slug = 'hopper';

-- (no row for guidegeek — see header)

update agents set
  external_rating = 4.9,
  external_rating_count = null,
  external_rating_source = 'App Store',
  external_rating_url = 'https://apps.apple.com/us/app/wanderlog-travel-planner/id1476732439'
where slug = 'wanderlog';

commit;
