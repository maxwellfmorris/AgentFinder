-- Migration: 0025_catalog_growth_batch3
-- Adds 6 real, currently-operating consumer AI products to fill out the lighter
-- categories. Brings catalog from 18 → 24:
--   Writing & Communication +2 (ChatGPT, Claude.ai)
--   Learning & Skills +1 (Quizlet)
--   Money & Finances +1 (Rocket Money)
--   Hobbies & Creative +2 (Canva, Runway)
-- Same approach as 0014/0016: original descriptions, trust_tier 'listed',
-- status 'published', honest external ratings only where a clear public source
-- could be verified (Claude, Quizlet, Canva, Runway). ChatGPT and Rocket Money
-- left NULL — search wouldn't surface specific numbers despite the App Store
-- pages being real.
-- The search_vector trigger from 0019 fires on each INSERT, so the new rows
-- are searchable as soon as they land.
-- Idempotent: on conflict (slug) do nothing.

begin;

insert into agents (
  name, slug, tagline, description, website, logo_url, category,
  industry_tags, platform_integrations, pricing_model, setup_complexity,
  trust_tier, status, average_rating, review_count,
  use_cases, limitations, keywords,
  external_rating, external_rating_count, external_rating_source, external_rating_url
) values
  (
    'ChatGPT', 'chatgpt',
    'The general-purpose AI assistant most people use first',
    'ChatGPT is OpenAI''s all-purpose conversational AI — answer questions, draft emails or essays, brainstorm ideas, summarize articles, generate images, and analyze files. The free tier covers most everyday tasks; ChatGPT Plus adds priority access, advanced models, and voice mode. Available on web, iOS, and Android.',
    'https://chat.openai.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=chatgpt&backgroundColor=dbeafe',
    'Writing & Communication',
    ARRAY['Anyone', 'Students', 'Job Seekers', 'Creators'],
    ARRAY[]::text[],
    'freemium', 'plug_and_play', 'listed', 'published', null, 0,
    ARRAY[
      'Brainstorm and draft on any topic',
      'Summarize a long article or document',
      'Explain a tricky concept in plain language',
      'Polish an email before you send it'
    ],
    ARRAY[
      'Can confidently get facts wrong — always verify important info',
      'Free tier uses older or rate-limited models',
      'Web search and image generation in the free tier are limited'
    ],
    ARRAY['chatgpt','openai','gpt','ai assistant','conversational ai','generative ai','ai chat','writing help','brainstorm','question answering'],
    null, null, null, null
  ),
  (
    'Claude.ai', 'claude-ai',
    'A thoughtful AI assistant especially good at writing and reasoning',
    'Claude is Anthropic''s general-purpose AI, known for careful, structured responses — particularly strong on long writing tasks, document analysis, and following nuanced instructions. The free tier handles everyday questions; Claude Pro adds more usage and access to the most capable models. Available on web and mobile.',
    'https://claude.ai',
    'https://api.dicebear.com/7.x/shapes/svg?seed=claude-ai&backgroundColor=dbeafe',
    'Writing & Communication',
    ARRAY['Anyone', 'Students', 'Writers', 'Job Seekers'],
    ARRAY[]::text[],
    'freemium', 'plug_and_play', 'listed', 'published', null, 0,
    ARRAY[
      'Draft a long-form piece (essay, post, report)',
      'Have a complex document explained or summarized',
      'Reason through a tricky decision out loud',
      'Edit and refine your own writing with feedback'
    ],
    ARRAY[
      'Like all AI, can be confidently wrong on specifics — double-check facts',
      'Free tier has usage limits that reset every few hours',
      'No web search or image generation on the free tier'
    ],
    ARRAY['claude','anthropic','ai assistant','ai writing','document analysis','long-form','reasoning','ai chat','generative ai','writing help'],
    4.6, 152000, 'App Store', 'https://apps.apple.com/us/app/claude-by-anthropic/id6473753684'
  ),
  (
    'Quizlet', 'quizlet',
    'AI study tools that turn your notes into flashcards and quizzes',
    'Quizlet takes the classic flashcard idea and adds AI on top — paste in your notes and it builds practice sets, generates quizzes, and (with Q-Chat) tutors you on the material. Widely used by students at every level. Free for the basics; Quizlet Plus unlocks AI features like Magic Notes and unlimited Q-Chat.',
    'https://quizlet.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=quizlet&backgroundColor=fef3c7',
    'Learning & Skills',
    ARRAY['Students', 'Adult Learners', 'Test Takers'],
    ARRAY[]::text[],
    'freemium', 'plug_and_play', 'listed', 'published', null, 0,
    ARRAY[
      'Turn class notes into flashcards in seconds',
      'Quiz yourself before a test with auto-generated questions',
      'Ask Q-Chat to explain a concept like a tutor',
      'Share study sets with classmates'
    ],
    ARRAY[
      'The strongest AI study tools require Quizlet Plus',
      'Quality depends on the notes you paste in (garbage in, garbage out)',
      'Free tier shows ads between activities'
    ],
    ARRAY['flashcards','study app','test prep','vocabulary','memorization','exam study','q-chat','ai tutor','homework help','learning'],
    4.78, 1100000, 'App Store', 'https://apps.apple.com/us/app/quizlet-ai-powered-flashcards/id546473125'
  ),
  (
    'Rocket Money', 'rocket-money',
    'AI that finds your forgotten subscriptions and helps cancel or negotiate them',
    'Rocket Money (formerly Truebill) links to your bank and credit cards and uses AI to spot recurring charges — useful for catching subscriptions you forgot about. Premium plans add active bill negotiation (they''ll contact your providers to ask for lower rates) and budget tools. Free to track and identify; you pay if you want them to do the work.',
    'https://www.rocketmoney.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=rocket-money&backgroundColor=d1fae5',
    'Money & Finances',
    ARRAY['Anyone Budgeting', 'Renters', 'Couples', 'Subscribers'],
    ARRAY['Bank & credit accounts'],
    'freemium', 'low', 'listed', 'published', null, 0,
    ARRAY[
      'See every recurring charge across your accounts',
      'Cancel an unwanted subscription in a few taps',
      'Have them negotiate cable/internet/phone bills for you',
      'Track spending and set savings goals'
    ],
    ARRAY[
      'Bill negotiation is a Premium feature with success-based fees',
      'Bank linking only works in the US',
      'Some smaller billers or services aren''t recognized automatically'
    ],
    ARRAY['subscription tracker','recurring charges','bill negotiation','cancel subscriptions','truebill','expense tracker','budget','save money','rocket money','finance'],
    null, null, null, null
  ),
  (
    'Canva', 'canva',
    'Drag-and-drop design with AI tools to write, generate, and edit',
    'Canva is the consumer design tool millions of non-designers use for social posts, presentations, invitations, and more. Recently rolled out a Magic Studio of AI features — Magic Write for copy, Magic Design for layouts, AI image generation, background removal — built right into the editor. Free tier is generous; Canva Pro unlocks all AI tools and premium templates.',
    'https://www.canva.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=canva&backgroundColor=fce7f3',
    'Hobbies & Creative',
    ARRAY['Creators', 'Hobbyists', 'Small Business', 'Anyone'],
    ARRAY['Google Drive', 'Dropbox', 'Instagram'],
    'freemium', 'plug_and_play', 'listed', 'published', null, 0,
    ARRAY[
      'Make a social post or invitation from a template',
      'Generate an AI image to use in a design',
      'Write headline copy with Magic Write',
      'Resize one design for every platform with a click'
    ],
    ARRAY[
      'Most Magic Studio AI features require Canva Pro',
      'Output is good for everyday use but won''t beat dedicated design tools',
      'Free tier limits stock photos, fonts, and elements'
    ],
    ARRAY['graphic design','design tool','social media graphics','presentations','magic write','ai design','templates','image generation','branding','canva'],
    4.9, null, 'App Store', 'https://apps.apple.com/us/app/canva-ai-video-photo-editor/id897446215'
  ),
  (
    'Runway', 'runway',
    'AI video generation and editing — turn text or images into short clips',
    'Runway is the leading consumer AI video tool — generate short clips from a text prompt or an image, edit existing footage with AI (remove backgrounds, expand scenes), and try a growing set of generative tools. Free tier comes with a small monthly credit; subscriptions unlock more credits and longer/higher-resolution outputs.',
    'https://runwayml.com',
    'https://api.dicebear.com/7.x/shapes/svg?seed=runway&backgroundColor=fce7f3',
    'Hobbies & Creative',
    ARRAY['Creators', 'Filmmakers', 'Content Creators', 'Hobbyists'],
    ARRAY[]::text[],
    'freemium', 'plug_and_play', 'listed', 'published', null, 0,
    ARRAY[
      'Generate a short video clip from a written description',
      'Animate a still image',
      'Remove or replace a video background',
      'Expand the borders of a photo or scene with generative outpainting'
    ],
    ARRAY[
      'Generation costs credits — the free tier doesn''t go far',
      'Best results often take multiple attempts and prompt tweaking',
      'Clips are still short (typically a few seconds at a time)'
    ],
    ARRAY['ai video','text to video','video generation','generative video','video editing','image animation','generative ai','runway ml','video ai','runway'],
    4.7, 16, 'App Store', 'https://apps.apple.com/us/app/runwayml/id1665024375'
  )
on conflict (slug) do nothing;

commit;
