-- AgentFinder seed data — 5 placeholder agents
-- Run after schema.sql in your Supabase SQL editor

insert into agents (
  name, slug, tagline, description, website, logo_url,
  category, industry_tags, platform_integrations,
  pricing_model, setup_complexity, trust_tier,
  average_rating, review_count
) values

(
  'Draftly',
  'draftly',
  'Turn your bullet points into polished emails in seconds',
  'Draftly is an AI writing assistant that transforms rough notes into professional emails, proposals, and reports. Perfect for busy executives and account managers who need to communicate clearly without spending hours writing. It learns your tone over time and adapts to your industry''s language.',
  'https://example.com/draftly',
  'https://api.dicebear.com/7.x/shapes/svg?seed=draftly&backgroundColor=dbeafe',
  'Writing & Communication',
  ARRAY['Sales', 'Marketing', 'Executive'],
  ARRAY['Gmail', 'Outlook', 'Slack', 'Notion'],
  'freemium',
  'plug_and_play',
  'vetted',
  4.7,
  214
),

(
  'MeetingMind',
  'meetingmind',
  'Never write meeting notes again',
  'MeetingMind joins your calls, transcribes the conversation, and delivers a clean summary with action items and decisions — directly to your inbox within minutes of hanging up. Trusted by operations teams, consultants, and project managers at over 500 companies.',
  'https://example.com/meetingmind',
  'https://api.dicebear.com/7.x/shapes/svg?seed=meetingmind&backgroundColor=dcfce7',
  'Productivity & Meetings',
  ARRAY['Consulting', 'Operations', 'HR', 'Legal'],
  ARRAY['Zoom', 'Google Meet', 'Microsoft Teams', 'Notion', 'Jira'],
  'subscription',
  'plug_and_play',
  'audited',
  4.5,
  389
),

(
  'DataNarrator',
  'data-narrator',
  'Ask your spreadsheet a question, get a plain-English answer',
  'DataNarrator connects to your existing data sources and lets you ask questions in plain language — no SQL, no formulas. Get instant charts, summaries, and trend reports that you can share with your team. Ideal for business analysts and department heads who want insights without depending on the data team.',
  'https://example.com/datanarrator',
  'https://api.dicebear.com/7.x/shapes/svg?seed=datanarrator&backgroundColor=fef9c3',
  'Data & Analytics',
  ARRAY['Finance', 'Retail', 'Healthcare', 'Operations'],
  ARRAY['Google Sheets', 'Excel', 'Airtable', 'Salesforce', 'HubSpot'],
  'subscription',
  'low',
  'verified',
  4.3,
  156
),

(
  'HireAssist',
  'hire-assist',
  'Screen 100 resumes while you take your lunch break',
  'HireAssist reviews incoming applications against your job description, scores candidates on fit, and drafts personalized outreach emails — all before you sit back down. Recruiters and HR teams use it to cut time-to-shortlist by 60% without sacrificing quality.',
  'https://example.com/hireassist',
  'https://api.dicebear.com/7.x/shapes/svg?seed=hireassist&backgroundColor=fce7f3',
  'HR & Recruiting',
  ARRAY['HR', 'Staffing', 'Tech', 'Finance'],
  ARRAY['Greenhouse', 'Lever', 'Workday', 'LinkedIn', 'Gmail'],
  'usage_based',
  'low',
  'listed',
  4.1,
  78
),

(
  'ClientPulse',
  'clientpulse',
  'Know how your clients feel before they tell you',
  'ClientPulse monitors your email threads, support tickets, and CRM notes to flag accounts that show signs of churn risk or upsell opportunity. It surfaces the right client at the right moment so your team can act proactively. Built for customer success managers and account executives at B2B companies.',
  'https://example.com/clientpulse',
  'https://api.dicebear.com/7.x/shapes/svg?seed=clientpulse&backgroundColor=ede9fe',
  'Customer Success',
  ARRAY['SaaS', 'Professional Services', 'Finance'],
  ARRAY['Salesforce', 'HubSpot', 'Zendesk', 'Gmail', 'Slack'],
  'subscription',
  'medium',
  'vetted',
  4.6,
  102
);
