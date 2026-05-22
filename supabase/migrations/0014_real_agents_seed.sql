-- Migration: 0014_real_agents_seed
-- Seeds 12 real, currently-operating consumer AI products across all seven
-- live categories. Descriptions are original (not copied from marketing).
-- All seeded as trust_tier 'listed' (honest: editorially added, self-reported),
-- status 'published' (curated, so live), with empty ratings (no fabricated
-- numbers on real products — they earn reviews over time).
-- Idempotent: on conflict (slug) do nothing.

begin;

insert into agents (
  name, slug, tagline, description, website, logo_url, category,
  industry_tags, platform_integrations, pricing_model, setup_complexity,
  trust_tier, status, average_rating, review_count
) values
  (
    'Grammarly', 'grammarly',
    'Real-time writing help that catches mistakes and sharpens your tone',
    'Grammarly checks spelling, grammar, clarity, and tone as you write — across email, documents, and the web. Its AI can rewrite sentences, adjust formality, or draft from a prompt, so your messages land the way you intend. It runs as a browser extension and inside apps like Gmail, Google Docs, and Word.',
    'https://www.grammarly.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=grammarly&backgroundColor=dbeafe',
    'Writing & Communication',
    ARRAY['Students', 'Job Seekers', 'Anyone'],
    ARRAY['Gmail', 'Google Docs', 'Microsoft Word', 'Chrome'],
    'freemium', 'plug_and_play', 'listed', 'published', null, 0
  ),
  (
    'Wordtune', 'wordtune',
    'Rewrite any sentence until it says exactly what you mean',
    'Wordtune rephrases your writing into clearer, more natural versions — casual or formal, shorter or longer — with a click. It can also summarize long passages and suggest fluency fixes when the words won''t come. Useful for emails, essays, and posts you want to sound right.',
    'https://www.wordtune.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=wordtune&backgroundColor=dbeafe',
    'Writing & Communication',
    ARRAY['Students', 'Job Seekers', 'Anyone'],
    ARRAY['Chrome', 'Gmail', 'Google Docs', 'Microsoft Word'],
    'freemium', 'plug_and_play', 'listed', 'published', null, 0
  ),
  (
    'Khanmigo', 'khanmigo',
    'A patient AI tutor that guides you to the answer, not just at it',
    'Khanmigo is Khan Academy''s AI tutor. Rather than handing over answers, it asks questions and walks you through problems step by step — across math, science, writing, and more. Built by an education nonprofit, it''s free for teachers and a few dollars a month for learners and parents.',
    'https://www.khanmigo.ai',
    'https://api.dicebear.com/7.x/shapes/svg?seed=khanmigo&backgroundColor=fef3c7',
    'Learning & Skills',
    ARRAY['Students', 'Parents', 'Adult Learners'],
    ARRAY['Khan Academy', 'Google Classroom'],
    'freemium', 'plug_and_play', 'listed', 'published', null, 0
  ),
  (
    'Duolingo', 'duolingo',
    'Learn a language in bite-sized, game-like daily lessons',
    'Duolingo teaches dozens of languages through short lessons that fit into a few minutes a day. Its AI features (Duolingo Max) add roleplay conversations and plain-language explanations of your mistakes. Free to use, with an ad-free paid tier.',
    'https://www.duolingo.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=duolingo&backgroundColor=fef3c7',
    'Learning & Skills',
    ARRAY['Students', 'Adult Learners', 'Travelers'],
    ARRAY[]::text[],
    'freemium', 'plug_and_play', 'listed', 'published', null, 0
  ),
  (
    'Cleo', 'cleo',
    'A money chat that breaks down your spending and nudges you to save',
    'Cleo is a budgeting app you talk to like a friend. Connect your accounts and ask plain questions — "can I afford this?", "where did my money go?" — and get back blunt, useful answers, spending breakdowns, and savings nudges. Known for its chat-first, sometimes-sassy style.',
    'https://www.meetcleo.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=cleo&backgroundColor=d1fae5',
    'Money & Finances',
    ARRAY['Students', 'Renters', 'Anyone Budgeting'],
    ARRAY['Bank & credit accounts'],
    'freemium', 'low', 'listed', 'published', null, 0
  ),
  (
    'Copilot Money', 'copilot-money',
    'A beautiful, AI-categorized view of all your money in one place',
    'Copilot Money links your bank, credit, and investment accounts and uses AI to categorize every transaction automatically — so spending, net worth, and trends are visible at a glance. Polished and privacy-minded, with a 30-day trial. Strongest on iPhone and Mac, with a newer web app.',
    'https://www.copilot.money',
    'https://api.dicebear.com/7.x/shapes/svg?seed=copilot-money&backgroundColor=d1fae5',
    'Money & Finances',
    ARRAY['New Parents', 'Couples', 'Anyone Budgeting'],
    ARRAY['Bank & credit accounts', 'Apple'],
    'subscription', 'low', 'listed', 'published', null, 0
  ),
  (
    'Ohai.ai', 'ohai-ai',
    'A text-based assistant that runs your household''s schedule',
    'Ohai''s assistant "O" helps a busy household stay coordinated over text. It syncs everyone''s calendars, reads school newsletters and PDFs to pull out dates and tasks, and turns a quick voice note into reminders and to-dos. Built for parents juggling family logistics.',
    'https://www.ohai.ai',
    'https://api.dicebear.com/7.x/shapes/svg?seed=ohai-ai&backgroundColor=fee2e2',
    'Home & Family',
    ARRAY['Parents', 'Caregivers', 'Couples'],
    ARRAY['Google Calendar', 'Apple Calendar', 'Gmail'],
    'subscription', 'low', 'listed', 'published', null, 0
  ),
  (
    'Samsung Food', 'samsung-food',
    'Save recipes, plan a week of meals, and build the grocery list',
    'Samsung Food lets you save recipes from anywhere, plan meals on a drag-and-drop calendar, and generate a shared grocery list automatically. Its AI can build personalized weekly plans around your goals and guide you hands-free while cooking. The core planning tools are free.',
    'https://www.samsungfood.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=samsung-food&backgroundColor=fee2e2',
    'Home & Family',
    ARRAY['Parents', 'Home Cooks', 'Couples'],
    ARRAY['Grocery delivery'],
    'freemium', 'plug_and_play', 'listed', 'published', null, 0
  ),
  (
    'Wysa', 'wysa',
    'An AI companion for everyday mental wellbeing',
    'Wysa is a mental-health chatbot built on CBT and other evidence-based techniques. It offers a private, anonymous space to talk through stress, anxiety, or low mood, plus 200+ guided exercises for sleep, calm, and focus. A free tier covers the basics; paid plans add access to human coaches.',
    'https://www.wysa.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=wysa&backgroundColor=ede9fe',
    'Health & Wellness',
    ARRAY['Mental Wellness', 'Students', 'Anyone'],
    ARRAY[]::text[],
    'freemium', 'plug_and_play', 'listed', 'published', null, 0
  ),
  (
    'Midjourney', 'midjourney',
    'Turn a text description into striking, high-quality images',
    'Midjourney generates original images from text prompts, known for an especially artistic, polished look. Describe a scene or style and get back usable art for projects, posts, or pure experimentation. Subscription-based, used through its web app and Discord.',
    'https://www.midjourney.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=midjourney&backgroundColor=fce7f3',
    'Hobbies & Creative',
    ARRAY['Creators', 'Hobbyists'],
    ARRAY['Discord'],
    'subscription', 'low', 'listed', 'published', null, 0
  ),
  (
    'Suno', 'suno',
    'Make a full song — vocals and all — from a single description',
    'Suno creates complete songs from a text prompt, generating melody, instrumentation, and vocals in seconds. Describe a vibe, genre, or lyric idea and get back a track you can share. A free tier gives you a handful of songs a day; paid plans add commercial rights and more.',
    'https://www.suno.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=suno&backgroundColor=fce7f3',
    'Hobbies & Creative',
    ARRAY['Creators', 'Hobbyists'],
    ARRAY[]::text[],
    'freemium', 'plug_and_play', 'listed', 'published', null, 0
  ),
  (
    'Mindtrip', 'mindtrip',
    'Plan a full trip — itinerary, maps, and bookings — with an AI companion',
    'Mindtrip builds personalized travel itineraries from your preferences, complete with photos, maps, and reviews. Ask it to adjust plans, compare flights, or organize a group trip, and it keeps your bookings and saved places in one place. Free to start, on web and iOS.',
    'https://www.mindtrip.ai',
    'https://api.dicebear.com/7.x/shapes/svg?seed=mindtrip&backgroundColor=cffafe',
    'Travel & Planning',
    ARRAY['Travelers', 'Vacationers', 'Digital Nomads'],
    ARRAY['Google Maps'],
    'freemium', 'plug_and_play', 'listed', 'published', null, 0
  )
on conflict (slug) do nothing;

commit;
