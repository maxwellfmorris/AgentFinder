-- Migration: 0016_health_travel_agents
-- Adds 6 real, currently-operating consumer AI products to round out the two
-- thinnest live categories: Health & Wellness (Ada Health, WHOOP, Headspace)
-- and Travel & Planning (Hopper, GuideGeek, Wanderlog).
-- Same approach as 0014: original descriptions (not copied marketing),
-- trust_tier 'listed', status 'published', empty ratings (no fabricated numbers
-- on real products), neutral placeholder logos.
-- Idempotent: on conflict (slug) do nothing.

begin;

insert into agents (
  name, slug, tagline, description, website, logo_url, category,
  industry_tags, platform_integrations, pricing_model, setup_complexity,
  trust_tier, status, average_rating, review_count
) values
  (
    'Ada Health', 'ada-health',
    'Describe your symptoms and get a clear, careful read on what might be going on',
    'Ada is a free symptom checker that asks about your symptoms one question at a time, then compares your answers against a large medical knowledge base to suggest possible causes and next steps. It''s built for triage, not diagnosis — a calmer first stop than searching the web. A newer feature lets you describe how you feel in your own words, and you can run checks for family members too.',
    'https://ada.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=ada-health&backgroundColor=ede9fe',
    'Health & Wellness',
    ARRAY['Parents', 'Caregivers', 'Anyone'],
    ARRAY[]::text[],
    'free', 'plug_and_play', 'listed', 'published', null, 0
  ),
  (
    'WHOOP', 'whoop',
    'An AI coach that reads your body''s data and tells you how to train, rest, and recover',
    'WHOOP is a screenless fitness band that tracks your sleep, strain, and recovery around the clock. Its AI coach, powered by GPT-4, turns all that data into plain-language answers — ask why you slept badly or whether to push hard today, and it explains using your own numbers. Membership includes the band, and newer features can even build strength workouts from a text prompt.',
    'https://www.whoop.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=whoop&backgroundColor=ede9fe',
    'Health & Wellness',
    ARRAY['Quantified-Self', 'Athletes', 'Anyone Active'],
    ARRAY['Apple Health', 'Strava', 'TrainingPeaks'],
    'subscription', 'low', 'listed', 'published', null, 0
  ),
  (
    'Headspace', 'headspace',
    'Guided meditation plus an AI companion you can talk through a hard moment with',
    'Headspace is a meditation and sleep app with hundreds of guided sessions for stress, focus, and rest. Its AI companion, Ebb, lets you talk or type through what''s on your mind and responds with empathy, then points you to a fitting meditation or exercise. Subscription-based, with a free trial to start.',
    'https://www.headspace.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=headspace&backgroundColor=ede9fe',
    'Health & Wellness',
    ARRAY['Students', 'Busy Professionals', 'Mental Wellness'],
    ARRAY['Apple Health', 'Apple Watch'],
    'subscription', 'plug_and_play', 'listed', 'published', null, 0
  ),
  (
    'Hopper', 'hopper',
    'Predicts whether flight and hotel prices will rise or drop — so you book at the right time',
    'Hopper watches billions of flight and hotel prices and uses AI to forecast where they''re headed, telling you to buy now or wait. A color-coded calendar shows the cheapest days to travel, and you can freeze a price or get alerts when fares fall. Free to use, with optional paid extras like Price Freeze.',
    'https://www.hopper.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=hopper&backgroundColor=cffafe',
    'Travel & Planning',
    ARRAY['Travelers', 'Vacationers', 'Budget-Conscious'],
    ARRAY[]::text[],
    'free', 'plug_and_play', 'listed', 'published', null, 0
  ),
  (
    'GuideGeek', 'guidegeek',
    'A free AI travel guide you chat with right inside WhatsApp or Instagram',
    'GuideGeek is a free travel assistant from Matador Network that lives in the messaging apps you already use — WhatsApp, Instagram, or Messenger. Ask it for an itinerary, live flight and hotel prices, restaurant picks, or local tips, and it answers conversationally in dozens of languages. Nothing to download or sign up for — you just send a message.',
    'https://guidegeek.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=guidegeek&backgroundColor=cffafe',
    'Travel & Planning',
    ARRAY['Travelers', 'Solo Travelers', 'Spontaneous Trips'],
    ARRAY['WhatsApp', 'Instagram', 'Facebook Messenger'],
    'free', 'plug_and_play', 'listed', 'published', null, 0
  ),
  (
    'Wanderlog', 'wanderlog',
    'Build and organize a whole trip — itinerary, map, and reservations — with friends',
    'Wanderlog is a free trip planner that keeps your itinerary, map, budget, and bookings in one place, with live collaboration so a group can plan together. Its AI, built on ChatGPT, suggests places and drops them straight into your day-by-day plan, and a route optimizer reorders stops to save time. Core planning is free; a low-cost Pro tier adds extras like PDF export.',
    'https://wanderlog.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=wanderlog&backgroundColor=cffafe',
    'Travel & Planning',
    ARRAY['Travelers', 'Couples', 'Group Trips'],
    ARRAY['Google Maps', 'Gmail'],
    'freemium', 'plug_and_play', 'listed', 'published', null, 0
  )
on conflict (slug) do nothing;

commit;
