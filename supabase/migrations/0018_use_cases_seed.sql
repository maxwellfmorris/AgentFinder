-- Migration: 0018_use_cases_seed
-- Seeds "Good for" use-cases for the remaining 17 agents (Grammarly was seeded
-- in 0017). Honest, plain-language phrases reflecting the real features of
-- each product — no payment, no fabricated claims.
-- Idempotent: slug-scoped UPDATEs; re-running just overwrites with the same values.

begin;

update agents set use_cases = ARRAY[
  'Rewrite a sentence until it sounds right',
  'Make a message more formal or more casual',
  'Shorten or expand a paragraph',
  'Summarize a long article or email'
] where slug = 'wordtune';

update agents set use_cases = ARRAY[
  'Get unstuck on a math problem step by step',
  'Have a tricky concept explained another way',
  'Practice for a test with a patient tutor',
  'Get writing feedback without being handed the answer'
] where slug = 'khanmigo';

update agents set use_cases = ARRAY[
  'Learn a language a few minutes a day',
  'Practice a real conversation through roleplay',
  'Understand why an answer was wrong',
  'Keep a daily streak to build the habit'
] where slug = 'duolingo';

update agents set use_cases = ARRAY[
  'See where your money went this month',
  'Ask "can I afford this?" before you buy',
  'Set aside money toward a goal',
  'Get a nudge before you overspend'
] where slug = 'cleo';

update agents set use_cases = ARRAY[
  'See all your accounts in one place',
  'Auto-categorize every transaction',
  'Track your net worth over time',
  'Spot spending trends at a glance'
] where slug = 'copilot-money';

update agents set use_cases = ARRAY[
  'Keep the whole family''s calendar in sync',
  'Turn a school newsletter into dates and to-dos',
  'Capture a reminder from a quick voice note',
  'Coordinate household logistics over text'
] where slug = 'ohai-ai';

update agents set use_cases = ARRAY[
  'Save recipes from anywhere in one place',
  'Plan a week of meals on a calendar',
  'Auto-build a grocery list from your plan',
  'Get a personalized weekly meal plan'
] where slug = 'samsung-food';

update agents set use_cases = ARRAY[
  'Talk through stress or anxiety anytime',
  'Try a guided exercise for a low mood',
  'Wind down with a sleep or calm session',
  'Vent privately and anonymously'
] where slug = 'wysa';

update agents set use_cases = ARRAY[
  'Check what a symptom might mean',
  'Answer a few questions to narrow it down',
  'Decide whether it''s worth seeing a doctor',
  'Run a check for a family member'
] where slug = 'ada-health';

update agents set use_cases = ARRAY[
  'Understand why you slept poorly',
  'Find out if today''s a hard or easy day',
  'Ask your own data a plain-language question',
  'Build a strength workout from a prompt'
] where slug = 'whoop';

update agents set use_cases = ARRAY[
  'Start a guided meditation for stress',
  'Wind down with a sleep sound or story',
  'Talk through what''s on your mind with Ebb',
  'Build a daily mindfulness habit'
] where slug = 'headspace';

update agents set use_cases = ARRAY[
  'Turn a written idea into an image',
  'Explore a specific art style or mood',
  'Create artwork for a post or project',
  'Refine a prompt until it looks right'
] where slug = 'midjourney';

update agents set use_cases = ARRAY[
  'Make a full song from a description',
  'Turn a lyric idea into a track',
  'Try a song in a specific genre or vibe',
  'Create a personalized song for someone'
] where slug = 'suno';

update agents set use_cases = ARRAY[
  'Build a personalized trip itinerary',
  'Adjust the plan by just asking',
  'Keep bookings and saved places in one spot',
  'Plan a trip together as a group'
] where slug = 'mindtrip';

update agents set use_cases = ARRAY[
  'Check if a flight''s price will rise or drop',
  'Find the cheapest days to fly',
  'Freeze a fare while you decide',
  'Get alerted when prices fall'
] where slug = 'hopper';

update agents set use_cases = ARRAY[
  'Ask for travel tips right in WhatsApp',
  'Get a quick itinerary on the go',
  'Find restaurant and activity picks',
  'Check live flight and hotel prices'
] where slug = 'guidegeek';

update agents set use_cases = ARRAY[
  'Organize your itinerary, map, and bookings',
  'Plan a trip together with friends',
  'Get AI place suggestions for your route',
  'Reorder stops to save travel time'
] where slug = 'wanderlog';

commit;
