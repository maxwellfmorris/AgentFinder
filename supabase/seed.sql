-- AgentFinder consumer catalog seed
-- Run after schema.sql and all migrations.
-- All inserts use ON CONFLICT (slug) DO NOTHING — safe to re-run.

-- Writing & Communication (6 agents)

insert into agents (name, slug, tagline, description, website, logo_url, category, industry_tags, platform_integrations, pricing_model, setup_complexity, trust_tier, average_rating, review_count)
values (
  'Draftly', 'draftly',
  'Turn your bullet points into polished messages in seconds',
  'Draftly transforms rough notes into polished emails, letters, and messages. Perfect for anyone who freezes up at a blank screen — writing to a landlord, drafting a difficult message to a relative, or crafting cover letters. It learns your tone over time and adapts to who you''re writing to.',
  'https://example.com/draftly',
  'https://api.dicebear.com/7.x/shapes/svg?seed=draftly&backgroundColor=dbeafe',
  'Writing & Communication',
  ARRAY['Renters', 'Job Seekers', 'Caregivers', 'Anyone'],
  ARRAY['Gmail', 'Outlook', 'Apple Mail', 'Notion'],
  'freemium', 'plug_and_play', 'vetted', 4.7, 214
) on conflict (slug) do nothing;

insert into agents (name, slug, tagline, description, website, logo_url, category, industry_tags, platform_integrations, pricing_model, setup_complexity, trust_tier, average_rating, review_count)
values (
  'MeetingMind', 'meetingmind',
  'Never write meeting notes again',
  'MeetingMind joins your calls — work, family, or interviews — transcribes the conversation, and delivers a clean summary with action items and decisions to your inbox within minutes of hanging up. Used by students, caregivers, podcasters, and anyone who wants to focus on the conversation instead of taking notes.',
  'https://example.com/meetingmind',
  'https://api.dicebear.com/7.x/shapes/svg?seed=meetingmind&backgroundColor=dcfce7',
  'Writing & Communication',
  ARRAY['Students', 'Caregivers', 'Creators', 'Anyone'],
  ARRAY['Zoom', 'Google Meet', 'Notion', 'Google Drive'],
  'subscription', 'plug_and_play', 'audited', 4.5, 389
) on conflict (slug) do nothing;

insert into agents (name, slug, tagline, description, website, logo_url, category, industry_tags, platform_integrations, pricing_model, setup_complexity, trust_tier, average_rating, review_count)
values (
  'BriefBot', 'brief-bot',
  'Turn long documents into one-page summaries',
  'BriefBot condenses lengthy documents — research papers, lease agreements, dense articles, email threads — into crisp, decision-ready summaries. Upload a PDF or paste a link and get a structured brief in under 30 seconds. Used by students, renters reviewing leases, and anyone who wants to understand long docs without reading every word.',
  'https://example.com/briefbot',
  'https://api.dicebear.com/7.x/shapes/svg?seed=briefbot&backgroundColor=e0f2fe',
  'Writing & Communication',
  ARRAY['Students', 'Renters', 'Caregivers', 'Curious Readers'],
  ARRAY['Notion', 'Google Drive', 'Dropbox'],
  'freemium', 'plug_and_play', 'verified', 4.4, 203
) on conflict (slug) do nothing;

insert into agents (name, slug, tagline, description, website, logo_url, category, industry_tags, platform_integrations, pricing_model, setup_complexity, trust_tier, average_rating, review_count)
values (
  'AgendaAI', 'agenda-ai',
  'Build a structured agenda for any meeting in 60 seconds',
  'AgendaAI creates clear, timed agendas from a quick description of your meeting goals. Whether it''s a book club, a family planning session, a project meeting, or a community board, it suggests the right structure and shares a clean agenda with attendees before the call.',
  'https://example.com/agendaai',
  'https://api.dicebear.com/7.x/shapes/svg?seed=agendaai&backgroundColor=fef9c3',
  'Writing & Communication',
  ARRAY['Hobbyists', 'Parents', 'Volunteers'],
  ARRAY['Google Calendar', 'Apple Calendar', 'Notion'],
  'free', 'plug_and_play', 'listed', 4.2, 91
) on conflict (slug) do nothing;

insert into agents (name, slug, tagline, description, website, logo_url, category, industry_tags, platform_integrations, pricing_model, setup_complexity, trust_tier, average_rating, review_count)
values (
  'RecapAI', 'recap-ai',
  'Your weekly recap, written automatically',
  'RecapAI pulls from your calendar, emails, and notes to write a clean weekly recap every Friday. Use it for personal records, share with a partner or family, or just remember what you actually accomplished. No more wondering where the week went.',
  'https://example.com/recapai',
  'https://api.dicebear.com/7.x/shapes/svg?seed=recapai&backgroundColor=d1fae5',
  'Writing & Communication',
  ARRAY['Hobbyists', 'Anyone', 'Quantified-Self'],
  ARRAY['Google Calendar', 'Apple Calendar', 'Notion', 'Gmail'],
  'freemium', 'low', 'verified', 4.3, 118
) on conflict (slug) do nothing;

insert into agents (name, slug, tagline, description, website, logo_url, category, industry_tags, platform_integrations, pricing_model, setup_complexity, trust_tier, average_rating, review_count)
values (
  'ReplyRight', 'reply-right',
  'Answer your inbox in seconds, not hours',
  'ReplyRight reads incoming emails and drafts on-tone responses instantly. You review and send. It learns your voice over time. Perfect for anyone drowning in personal email — coordinating logistics, replying to invitations, managing communication with schools or service providers.',
  'https://example.com/replyright',
  'https://api.dicebear.com/7.x/shapes/svg?seed=replyright&backgroundColor=fce7f3',
  'Writing & Communication',
  ARRAY['Parents', 'Anyone', 'Email-Overwhelmed'],
  ARRAY['Gmail', 'Outlook', 'Apple Mail'],
  'freemium', 'plug_and_play', 'verified', 4.5, 276
) on conflict (slug) do nothing;

-- Learning & Skills (1 agent)

insert into agents (name, slug, tagline, description, website, logo_url, category, industry_tags, platform_integrations, pricing_model, setup_complexity, trust_tier, average_rating, review_count)
values (
  'Tutorly', 'tutorly',
  'A patient AI tutor for any subject',
  'Tutorly helps you learn anything — math, code, languages, history, science. It explains concepts step by step, adapts to your pace, asks Socratic questions to deepen understanding, and never makes you feel dumb for asking. Used by students of all ages and adults filling in knowledge gaps.',
  'https://example.com/tutorly',
  'https://api.dicebear.com/7.x/shapes/svg?seed=tutorly&backgroundColor=fef3c7',
  'Learning & Skills',
  ARRAY['Students', 'Parents', 'Adult Learners'],
  ARRAY['Notion', 'Google Drive'],
  'freemium', 'plug_and_play', 'verified', 4.6, 184
) on conflict (slug) do nothing;

-- Money & Finances (2 agents)

insert into agents (name, slug, tagline, description, website, logo_url, category, industry_tags, platform_integrations, pricing_model, setup_complexity, trust_tier, average_rating, review_count)
values (
  'DataNarrator', 'data-narrator',
  'Ask your spreadsheet a question, get a plain-English answer',
  'DataNarrator connects to your personal spreadsheets — budgets, investment trackers, fitness logs, anything — and lets you ask questions in plain language. "How much did I spend on takeout last month?" "Is my spending trending up?" Get instant charts, summaries, and patterns without learning formulas.',
  'https://example.com/datanarrator',
  'https://api.dicebear.com/7.x/shapes/svg?seed=datanarrator&backgroundColor=fef9c3',
  'Money & Finances',
  ARRAY['Anyone', 'Quantified-Self', 'Money-Curious'],
  ARRAY['Google Sheets', 'Excel', 'Dropbox', 'Google Drive'],
  'subscription', 'low', 'verified', 4.3, 156
) on conflict (slug) do nothing;

insert into agents (name, slug, tagline, description, website, logo_url, category, industry_tags, platform_integrations, pricing_model, setup_complexity, trust_tier, average_rating, review_count)
values (
  'BudgetSense', 'budget-sense',
  'Know where your money goes — without spreadsheets',
  'BudgetSense connects to your bank and credit accounts, categorizes spending automatically, and shows you patterns you''d never spot manually. Alerts you when you''re trending over budget. Helps you set realistic savings goals. Private by design — your data is never sold or used for ads.',
  'https://example.com/budgetsense',
  'https://api.dicebear.com/7.x/shapes/svg?seed=budgetsense&backgroundColor=d1fae5',
  'Money & Finances',
  ARRAY['New Parents', 'Renters', 'Anyone Budgeting'],
  ARRAY['Apple Mail', 'Gmail', 'Google Sheets', 'Excel'],
  'freemium', 'low', 'verified', 4.5, 312
) on conflict (slug) do nothing;

-- Home & Family (1 agent)

insert into agents (name, slug, tagline, description, website, logo_url, category, industry_tags, platform_integrations, pricing_model, setup_complexity, trust_tier, average_rating, review_count)
values (
  'MealMate', 'meal-mate',
  'A week of dinners, planned around what''s in your fridge',
  'MealMate tells you what to cook based on what you already have, your family''s tastes, dietary restrictions, and how much time you have. Generates a shopping list for missing items. Adapts as you skip or swap meals. Cuts grocery waste and Wednesday-night "what''s for dinner" stress.',
  'https://example.com/mealmate',
  'https://api.dicebear.com/7.x/shapes/svg?seed=mealmate&backgroundColor=fee2e2',
  'Home & Family',
  ARRAY['Parents', 'Home Cooks', 'Couples'],
  ARRAY['Notion', 'Apple Calendar', 'Google Calendar'],
  'freemium', 'plug_and_play', 'verified', 4.7, 421
) on conflict (slug) do nothing;

-- Health & Wellness (1 agent)

insert into agents (name, slug, tagline, description, website, logo_url, category, industry_tags, platform_integrations, pricing_model, setup_complexity, trust_tier, average_rating, review_count)
values (
  'DayPulse', 'day-pulse',
  'Track your mood and energy, spot what actually matters',
  'A daily two-minute check-in. Asks about your mood, sleep, energy, and what happened today. Surfaces weekly patterns — "you sleep better after walks," "your mood dips on Mondays." Privacy-first: your entries stay yours, never sold, never analyzed by humans.',
  'https://example.com/daypulse',
  'https://api.dicebear.com/7.x/shapes/svg?seed=daypulse&backgroundColor=ede9fe',
  'Health & Wellness',
  ARRAY['Quantified-Self', 'Mental Wellness', 'Sleep-Focused'],
  ARRAY['Apple Health', 'Strava'],
  'freemium', 'plug_and_play', 'vetted', 4.4, 167
) on conflict (slug) do nothing;

-- Hobbies & Creative (2 agents)

insert into agents (name, slug, tagline, description, website, logo_url, category, industry_tags, platform_integrations, pricing_model, setup_complexity, trust_tier, average_rating, review_count)
values (
  'ContentCalAI', 'content-cal-ai',
  'A month of social content, planned and drafted in an afternoon',
  'ContentCalAI generates a full monthly content calendar for personal creators, hobbyists, and side-project founders. It drafts captions, suggests visuals, and schedules posts across your channels. Stay consistent without scrambling for ideas every week.',
  'https://example.com/contentcalai',
  'https://api.dicebear.com/7.x/shapes/svg?seed=contentcalai&backgroundColor=e0e7ff',
  'Hobbies & Creative',
  ARRAY['Creators', 'Hobbyists'],
  ARRAY['Notion', 'Dropbox', 'Discord'],
  'freemium', 'low', 'verified', 4.2, 145
) on conflict (slug) do nothing;

insert into agents (name, slug, tagline, description, website, logo_url, category, industry_tags, platform_integrations, pricing_model, setup_complexity, trust_tier, average_rating, review_count)
values (
  'PixelMuse', 'pixel-muse',
  'Bring any idea to life as an image',
  'PixelMuse turns descriptions into high-quality images in seconds. Describe a scene — "a watercolor of a fox in autumn" — and get a usable image back. Great for hobbyist creators, journal illustrations, party invitations, story prompts, and visual brainstorming.',
  'https://example.com/pixelmuse',
  'https://api.dicebear.com/7.x/shapes/svg?seed=pixelmuse&backgroundColor=fce7f3',
  'Hobbies & Creative',
  ARRAY['Creators', 'Hobbyists', 'Parents'],
  ARRAY['Discord', 'Dropbox', 'Google Drive'],
  'subscription', 'plug_and_play', 'verified', 4.5, 538
) on conflict (slug) do nothing;

-- Travel & Planning (1 agent)

insert into agents (name, slug, tagline, description, website, logo_url, category, industry_tags, platform_integrations, pricing_model, setup_complexity, trust_tier, average_rating, review_count)
values (
  'Journie', 'journie',
  'A full trip itinerary in 5 minutes',
  'Tell Journie where you''re going, when, and what you like. It generates a day-by-day itinerary with restaurants, activities, walking routes, and Google Maps links. Adjusts on the fly when your plans change. Perfect for travelers who hate planning but love a good trip.',
  'https://example.com/journie',
  'https://api.dicebear.com/7.x/shapes/svg?seed=journie&backgroundColor=cffafe',
  'Travel & Planning',
  ARRAY['Travelers', 'Vacationers', 'Digital Nomads'],
  ARRAY['Google Calendar', 'Apple Calendar', 'Notion', 'WhatsApp'],
  'freemium', 'plug_and_play', 'verified', 4.3, 256
) on conflict (slug) do nothing;
