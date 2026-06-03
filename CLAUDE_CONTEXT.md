# bindie.ai — Context for a Fresh Claude Session

Save this file at the repo root. Paste its contents (or point Claude at it) at the start of any new chat to skip rediscovering the project.

---

## What this is

**bindie.ai** is a consumer-facing directory of AI tools for everyday life. Users come to find AI tools that help with writing, learning, money, home, health, hobbies, and travel — not work. The platform makes money via **subscription affiliate**: bindie.ai earns commission when users click through to a listed agent and subscribe. Editorial independence is a load-bearing trust claim and is explicitly disclosed on the site.

**Brand:** All lowercase. The brand name is "bindie.ai" — not "Bindie", not "BindieAI". The .ai is part of the identity. Display it as `bindie.ai` everywhere: header, footer, page titles, body copy.

**Target audience:** AI-curious individuals in their late 20s and up, using AI for personal life things outside of work. Mid-career-ish, tried ChatGPT, comfortable with technology but not developers, allergic to enterprise sales motions, attentive to honest peer-shaped reviews.

**Strategic anchors:**
- Modeled loosely after Wirecutter's editorial-affiliate trust pattern, *not* Angi/Thumbtack's pay-per-lead marketplace model.
- Pay-per-lead is explicitly avoided by design — featured listings are flat-fee + time-boxed only.
- AI agents are *task-shaped products* (the buyer's mental sentence is "I want a tool that can [verb]"), unlike services where the category *is* the job. So the discovery flow is task-driven (search box first), with category browse as a secondary lane.
- **Free model:** bindie.ai is free for users and free for developers to list on. Monetization is affiliate commissions + paid featured placements. No Stripe, no Workshop fees, no developer subscription.

---

## Business context

- **Legal entity:** LLC registered in Colorado with a FEIN. Operating as "bindie.ai" via DBA. Owner is moving to Massachusetts end of summer 2026 — LLC domestication or foreign registration decision deferred until then.
- **Banking:** Mercury account (existing, from prior business).
- **Domain:** bindie.ai — registered on Cloudflare Registrar (2-year, .ai TLD requires 2-year minimum).
- **Email:** Google Workspace Starter ($6/mo) — maxwell@bindie.ai as primary. Pending DNS verification as of this writing. MX records to be added to Cloudflare once verified.
- **Social:** X/Twitter account (@bindieai or @bindie_ai) — pending Gmail setup for account creation.
- **Vercel project:** `agent-finder` under `maxwell-morris-projects` org. Auto-deploys on push to `main`. `NEXT_PUBLIC_SITE_URL` should be set to `https://bindie.ai` in Vercel dashboard.

---

## Tech stack and runtime

- **Next.js 14.2.35** (App Router)
- **React 18**
- **TypeScript 5**
- **Tailwind CSS 3.4**
- **Supabase** (Postgres + Auth + SSR cookies)
  - `@supabase/ssr 0.10.2` for the cookie-aware server and browser clients
  - `@supabase/supabase-js 2.x` for the simple anon server client
- **lucide-react** for icons
- **Deployed on Vercel** (Hobby tier) — production auto-deploys on every push to `main`. bindie.ai custom domain live via Cloudflare DNS (two CNAME records pointing to Vercel, proxy disabled). Three env vars in Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL=https://bindie.ai`.
- **No third-party** charting library, no third-party analytics SDK. Everything telemetry-shaped lives in Supabase.
- **No LLM dependencies** in the codebase. Search uses Postgres FTS + pg_trgm fuzzy fallback.

### Runtime constraints

- **Repo path:** `/Users/sheamccusker/Desktop/MFMs Junk/VibeCoders/AgentFinder/` — must not contain an apostrophe. Next.js's metadata-route webpack loader doesn't escape apostrophes when interpolating absolute paths into error-message string literals, which breaks `npm run build`. (The folder was renamed from `MFM's Junk` → `MFMs Junk` to fix this.)
- **Dev server port:** usually `3000`. If a stale process is squatting, Next picks `3001`. Clean up with `lsof -ti:3000,3001 | xargs kill -9` from a separate terminal.
- **Supabase CLI is not wired up.** All migrations are applied manually by the user pasting SQL into the Supabase dashboard's SQL editor.
- **The user is a non-developer.** Work is done in Cowork: Claude edits the repo files directly and verifies with `npx tsc --noEmit` before handing off. The user then runs any SQL in the Supabase SQL editor and commits/pushes via their own terminal (push auto-deploys to Vercel). They prefer SQL pasted inline in chat, and clear labeling of which tool a command belongs in (Terminal vs Supabase) — conflating the two has caused errors.

---

## Directory structure (key folders only)

```
src/
├── app/
│   ├── page.tsx                       # Homepage — hero, search, categories, life-stage chips, featured, waitlist strip, trust strip
│   ├── layout.tsx                     # Root layout — wraps everything in AuthProvider + Header + footer
│   ├── sitemap.ts                     # SEO sitemap (per-agent URLs), BASE_URL = https://bindie.ai
│   ├── robots.ts                      # SEO robots.txt
│   ├── agents/
│   │   ├── page.tsx                   # Browse — filters, search, results grid
│   │   └── [slug]/page.tsx            # Agent detail — hero, About, At a Glance, Workshop callout, feedback dimensions, Reviews, JSON-LD
│   ├── submit/
│   │   ├── page.tsx                   # /submit shell
│   │   ├── SubmitForm.tsx             # Smart import + form. Includes Monetization section with optional affiliate_url field. Category includes "Other".
│   │   └── actions.ts                 # submitAgent (includes affiliate_url) + prefillFromUrl server actions
│   ├── dashboard/
│   │   ├── page.tsx                   # /dashboard — per-listing status badge + outbound click counts
│   │   └── feature-actions.ts         # purchaseFeature server action
│   ├── waitlist/
│   │   └── actions.ts                 # joinWaitlist server action → waitlist table
│   ├── feedback/
│   │   ├── page.tsx
│   │   ├── FeedbackForm.tsx
│   │   └── actions.ts
│   └── disclosure/page.tsx            # /disclosure — FTC affiliate policy, all copy updated to bindie.ai
├── components/
│   ├── Header.tsx                     # Shows "bindie.ai" logo mark
│   ├── NavAuthLinks.tsx               # Client island — auth-aware nav
│   ├── AuthProvider.tsx               # Context provider for current user
│   ├── SignInModal.tsx                # Magic-link sign-in
│   ├── AgentCard.tsx                  # Card with Workshop pill, affiliate dot indicator
│   ├── TierChip.tsx                   # listed/verified/vetted/audited
│   ├── EvalRow.tsx                    # Benchmark row with letter-grade chip
│   ├── QuickTaskCard.tsx              # ORPHANED — safe to delete
│   ├── ReviewForm.tsx                 # Workshop-aware. Includes feedback dimensions section (star rating + optional comment per dimension) when workshopActive + dimensions present
│   ├── ReviewsList.tsx                # Approved reviews with VerifiedChip + IncentivizedChip
│   ├── ReviewsSection.tsx             # Wraps ReviewForm + ReviewsList, accepts feedbackDimensions prop
│   ├── WaitlistStrip.tsx              # "Get notified when we launch" email capture strip on homepage
│   ├── HomeSearch.tsx                 # Task-driven search on homepage
│   ├── SearchBar.tsx                  # Search box on /agents
│   ├── SearchResultLink.tsx           # Wraps AgentCard for click logging
│   ├── FilterSidebar.tsx              # Category/Pricing/For Who/Works With filters
│   ├── MobileFilters.tsx              # Mobile filter drawer
│   ├── OutboundLink.tsx               # Fires logOutboundClick on click
│   ├── DashboardCard.tsx              # Stats grid now has 4 columns: reviews, verified avg, evals, outbound clicks
│   ├── DashboardSignInGate.tsx
│   └── HowToClimbModal.tsx
├── lib/
│   ├── supabase.ts                    # Simple anon server client
│   ├── supabase-browser.ts            # createBrowserClient — client components
│   ├── supabase-server.ts             # createServerClient w/ cookies() — server actions + auth
│   ├── session.ts                     # getSessionId() — reads af_sid cookie
│   ├── events.ts                      # logSearchEvent, logClickEvent, logOutboundClick
│   └── agents.ts                      # All data helpers. Includes: getAgents, getAgentBySlug, getFeaturedAgents, getLatestEvalsForAgent, getReviewStatsForAgent, getReviewCountSparkline, getAgentsBySlugs, getSimilarAgents, getOutboundUrl, getOutboundClickCount, getFeedbackDimensions
├── types/
│   └── database.ts                    # All shared types including FeedbackDimension, FeedbackResponse, WorkshopCreditCode, OutboundClick + all enums + label maps
└── middleware.ts                      # Sets httpOnly af_sid session cookie

supabase/
└── migrations/                        # 32 numbered migrations (0000–0031), applied in order in Supabase SQL editor
```

---

## Migration index

| # | File | What |
|---|---|---|
| 0000 | reviews_table | reviews table |
| 0001 | review_rating_trigger | Trigger recomputing agents.average_rating/review_count |
| 0002 | trust_tier | trust_tier enum |
| 0003 | agent_evals | Evals table + public-read RLS |
| 0004 | review_usage | usage_claim + months_used on reviews |
| 0005 | agent_owner | submitted_by_user_id FK |
| 0006 | featured | featured_until + featured_tier |
| 0007 | agent_tasks | Quick Tasks SKU table (ORPHANED) |
| 0008 | search_events | Telemetry table |
| 0009 | agents_search_vector | Original generated tsvector (replaced in 0019) |
| 0010 | remap_categories | B2B→consumer category remap |
| 0011 | consumer_catalog | Catalog cleanup |
| 0012 | feedback | Feedback table |
| 0013 | agent_status | status enum (pending/published/rejected) |
| 0014 | real_agents_seed | 12 real agents |
| 0015 | remove_fictional_agents | Delete example.com agents |
| 0016 | health_travel_agents | +6 agents |
| 0017 | agent_use_cases | use_cases text[] |
| 0018 | use_cases_seed | Seed use_cases for 17 agents |
| 0019 | agent_search_upgrade | keywords text[], pg_trgm, trigger-maintained search_vector, search_agents RPC |
| 0020 | search_stopwords | Stop-words filter in search_agents |
| 0021 | search_coverage_ranking | Coverage-first ORDER BY |
| 0022 | external_ratings | external_rating + source + url columns |
| 0023 | external_ratings_seed | Seed 19 of 24 agents with ratings |
| 0024 | agent_limitations | limitations text[] + seed all agents |
| 0025 | catalog_growth_batch3 | +6 agents (ChatGPT, Claude.ai, Quizlet, Rocket Money, Canva, Runway) — catalog now 24 |
| 0026 | affiliate_infrastructure | affiliate_url on agents; outbound_clicks table |
| 0027 | workshop_foundation | 9 workshop_* columns on agents; reviews.incentivized; workshop_credit_codes table |
| 0028 | workshop_review_approval | reviews.approved, usage_proof, usage_proof_url |
| 0029 | feedback_dimensions | feedback_dimensions table — core + custom per-agent dimensions |
| 0030 | feedback_responses | feedback_responses table — per-dimension ratings + comments |
| 0031 | waitlist | waitlist table — email capture, public insert, no public read |

---

## Current catalog (24 real agents)

All `trust_tier: listed`, `status: published`. Logos are DiceBear placeholders. External ratings seeded where publicly verifiable (19 of 24 — ChatGPT, Khanmigo, Midjourney, GuideGeek, Rocket Money intentionally NULL).

| Slug | Name | Category |
|---|---|---|
| grammarly | Grammarly | Writing & Communication |
| wordtune | Wordtune | Writing & Communication |
| hemingway-editor | Hemingway Editor | Writing & Communication |
| jasper | Jasper | Writing & Communication |
| khanmigo | Khanmigo | Learning & Skills |
| duolingo | Duolingo | Learning & Skills |
| quizlet | Quizlet | Learning & Skills |
| cleo | Cleo | Money & Finances |
| copilot-money | Copilot Money | Money & Finances |
| rocket-money | Rocket Money | Money & Finances |
| ohai-ai | Ohai.ai | Home & Family |
| samsung-food | Samsung Food | Home & Family |
| wysa | Wysa | Health & Wellness |
| ada-health | Ada Health | Health & Wellness |
| whoop | WHOOP | Health & Wellness |
| headspace | Headspace | Health & Wellness |
| midjourney | Midjourney | Hobbies & Creative |
| suno | Suno | Hobbies & Creative |
| canva | Canva | Hobbies & Creative |
| runway | Runway | Hobbies & Creative |
| mindtrip | Mindtrip | Travel & Planning |
| hopper | Hopper | Travel & Planning |
| guidegeek | GuideGeek | Travel & Planning |
| wanderlog | Wanderlog | Travel & Planning |

Categories also include **"Other"** as a catch-all option on the submit form for agents that don't fit the 7 defined categories.

---

## Key features built

### Search
Coverage-first ranking: (1) count of query tokens matching search_vector, (2) ts_rank, (3) word_similarity (pg_trgm, threshold 0.4), (4) name asc tiebreak. Stop-words filter strips common verbs/nouns before building the tsquery. OR-of-prefixes tsquery (e.g. `learn:* | italian:*`). `search_agents(q)` RPC declared in `Database['public']['Functions']`.

### Affiliate infrastructure
`affiliate_url` on agents. When set, `getOutboundUrl()` returns it with `isAffiliate: true`. `OutboundLink` fires `logOutboundClick` on click. Grape dot on card external icons, italic disclosure note on detail/compare CTAs. `/disclosure` page in footer. `outbound_clicks` table tracks all clicks with `was_affiliate` bool.

**Phase 3b (done):** `affiliate_url` field on submit form (Monetization section). `getOutboundClickCount()` in lib/agents.ts returns `{ total, affiliate, direct }`. Dashboard card shows outbound clicks as 4th stat, with affiliate/direct split when affiliate_url is set.

**Phase 3c (owner's task):** Sign up for affiliate programs (Impact for Grammarly, Canva, Headspace etc.), paste tracked URLs into Supabase via `update agents set affiliate_url = '...' where slug = '...'`.

### Workshop program
Developer opt-in program where indie AI developers offer credits (codes pool) in exchange for verified reviews. Free for developers.

**Schema:** 9 `workshop_*` columns on agents, `workshop_credit_codes` table, `reviews.incentivized` + `reviews.approved` + `reviews.usage_proof` + `reviews.usage_proof_url`.

**W1 (done):** Schema + visual signals (Workshop pill on cards, callout on detail page, IncentivizedChip on reviews).

**W2 (done):** Workshop-aware ReviewForm with usage_proof fields. Pending-state hold (approved=false). Three-state detail callout (offer/pending/earned). Founder approve+allocate workflow tested end-to-end.

**W3 (done):** `WORKSHOP_RUNBOOK.md` at repo root — SQL recipes for enable, upload codes, list pending, approve+allocate, reject, pause/resume, retire, inspect inventory, over-allocation recovery, feedback dimensions management, full test cycle.

**W4/W5 (shelved):** Payment infrastructure not needed — free model.

### Actionable feedback dimensions
Structured per-dimension feedback collected alongside Workshop reviews.

**Schema:** `feedback_dimensions` table (agent_id IS NULL = core, applies to all; agent_id NOT NULL = custom for that agent). 5 core dimensions seeded: Onboarding, Pricing Clarity, UI/UX, Support Quality, Value for Money. `feedback_responses` table stores rating (1–5) + optional comment per dimension per review.

**UI:** When `workshopActive` and dimensions exist, ReviewForm renders a "Rate specific areas" section below the usage proof fields. Each dimension has a 5-star picker; rating > 0 reveals an optional comment input. Responses inserted after the review row.

**Data flow:** `getFeedbackDimensions(agentId)` in lib/agents.ts → passed from detail page → ReviewsSection → ReviewForm.

### Waitlist
`waitlist` table (email, source, session_id, unique on email). `joinWaitlist` server action in `app/waitlist/actions.ts`. `WaitlistStrip` component on homepage between featured agents and trust strip — gradient grape/punch card, "Get notified when we launch" CTA, butter "Notify me" button, inline success state. Duplicate emails treated as silent success (no data leakage).

---

## Go-to-market status

**Current goal:** Get one stranger (not personally known) onto the site. Everything else is secondary.

**Done:**
- bindie.ai domain live, custom domain wired to Vercel
- Waitlist strip on homepage
- Google Workspace account created (pending DNS verification)
- Three outreach email templates written for: HumToBeats, Yogakosh, WhatCable (found on Product Hunt)

**Pending Gmail verification:**
- Create X account (@bindieai) with info@bindie.ai
- Send three outreach emails
- Sign up for Impact affiliate network (Grammarly, Canva, Headspace programs)

**Outreach strategy:**
- Target indie AI developers on Product Hunt (low upvote count = hungry for distribution)
- Lead with free listing, no strings, personalized first line about their specific product
- 10 emails/week, expect 2–3 replies
- Post authentically on Reddit (r/artificial, r/ChatGPT, r/productivity) once ready to share publicly

**Referral program:** Shelved. No paid tier = nothing to give away. Revisit after premium tier exists.

**Product Hunt launch:** Prep when closer to launch. Requires maker profile, screenshots, tagline, warm upvotes.

---

## Data model highlights

### agents table (key columns)
`id`, `slug` (unique), `name`, `tagline`, `description`, `website`, `logo_url`, `category`, `industry_tags text[]`, `platform_integrations text[]`, `use_cases text[]`, `limitations text[]`, `keywords text[]`, `pricing_model`, `setup_complexity`, `trust_tier`, `status`, `average_rating`, `review_count`, `featured_until`, `featured_tier`, `external_rating`, `external_rating_count`, `external_rating_source`, `external_rating_url`, `affiliate_url`, `search_vector` (trigger-maintained tsvector), `workshop_active`, `workshop_credit_amount`, `workshop_credit_type`, `workshop_credit_redemption_url`, `workshop_credit_redemption_instructions`, `workshop_target_reviews`, `workshop_reviews_remaining`, `workshop_started_at`, `workshop_paused`

### Three Supabase clients
1. `lib/supabase.ts → getSupabaseClient()` — anon, no cookies. Public reads.
2. `lib/supabase-browser.ts → getSupabaseBrowser()` — createBrowserClient. Client components.
3. `lib/supabase-server.ts → getSupabaseServer()` — createServerClient w/ cookies(). Server actions + auth.getUser().

### RLS overview
| Table | Public read | Public insert |
|---|---|---|
| agents | where status='published' | ❌ |
| reviews | ✓ | auth only |
| feedback_dimensions | ✓ | ❌ (service role) |
| feedback_responses | ✓ | auth only |
| outbound_clicks | ✓ | ✓ |
| workshop_credit_codes | auth (own claimed) | ❌ |
| waitlist | ❌ | ✓ |
| feedback | ❌ | ✓ |
| search_events | ✓ | ✓ |

---

## Conventions and rules

### Migrations
- Always paste into Supabase SQL editor — never Terminal.
- Wrap in `begin; ... commit;`.
- Idempotent: `create table if not exists`, `add column if not exists`, `drop policy if exists` before `create policy`.

### TypeScript
- No `any` casts in new code. Legacy `as any` on `supabase.from(...)` is pre-existing.
- All new DB tables must be declared in `Database['public']['Tables']` in `types/database.ts`.
- New DB functions must be declared in `Database['public']['Functions']`.
- All new Agent fields must cascade to `PLACEHOLDER_AGENTS` in `lib/agents.ts` (5 entries).

### Deploy ordering (critical)
1. Run SQL in Supabase dashboard first.
2. Then `git add -A && git commit -m "..." && git push`.
Never push code that reads new columns before the migration runs.

### Things explicitly never to do
- Don't add Stripe or any payment infrastructure (free model).
- Don't add a third-party analytics SDK.
- Don't add a third-party HTML parsing library (smart-import uses native fetch + regex).
- Don't add a third-party charting library.
- Don't fabricate ratings or reviews.
- Don't conflate `featured_tier` with `trust_tier`.
- Don't use `array_to_string(...)` in generated columns or expression indexes (STABLE, not IMMUTABLE — caused migration 0019 issue).
- Don't dress up the "sponsored" label as "Featured" or "Promoted".
- Don't change "bindie.ai" to title case anywhere in UI copy.

---

## Known debt (non-blocking)

- `QuickTaskCard.tsx`, `getTasksForAgent` in lib/agents.ts, `agent_tasks` table (migration 0007), `seed_tasks.sql` — all orphaned after Good-for repurpose. Safe to delete in a cleanup pass.
- `PLACEHOLDER_AGENTS` in lib/agents.ts still holds 5 fictional entries (Draftly, BudgetSense, MealMate, DayPulse, Journie). Dev-without-Supabase fallback only. Harmless.
- `AuthProvider.tsx`, `ReviewsList.tsx`, `SignInModal.tsx` each have a single `react-hooks/exhaustive-deps` warning. Pre-existing, non-blocking.
- `outbound_clicks` is public-read — exposes raw click data. Worth gating before public launch (aggregated views with per-agent filtering).
- `NEXT_PUBLIC_SITE_URL` env var needs to be set to `https://bindie.ai` in Vercel dashboard if not done already.

---

## What's next (ordered)

1. **Gmail verification + email live** — unblocks X account and outreach
2. **X account setup** — @bindieai, bindie.ai in bio, link to site
3. **First 10 outreach emails** — HumToBeats, Yogakosh, WhatCable + 7 more from Product Hunt research
4. **Impact affiliate signup** — once maxwell@bindie.ai is live; apply to Grammarly + Canva programs first
5. **Phase 3c** — populate affiliate_url for enrolled agents via Supabase SQL
6. **Product Hunt prep** — maker profile, screenshots, tagline (when closer to launch)
7. **Deferred:** Custom domain email aliases, referral program (shelved), Workshop W4/W5 (shelved), SEO programmatic pages, Quick Tasks cleanup

---

## How to get oriented quickly

1. Skim this file — especially "What this is", "Go-to-market status", and "What's next".
2. Read `src/types/database.ts` for the full data model.
3. Read `src/lib/agents.ts` for all data-access helpers.
4. Skim `src/app/page.tsx` for the homepage structure.
5. Run `git log --oneline -10` to see recent commits.
6. Read `WORKSHOP_RUNBOOK.md` for all Workshop SQL recipes.
