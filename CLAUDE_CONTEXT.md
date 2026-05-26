# AgentFinder — Context for a Fresh Claude Session

Save this file at the repo root. Paste its contents (or point Claude at it) at the start of any new chat to skip rediscovering the project.

---

## What this is

**AgentFinder** is a consumer-facing directory of AI agents for everyday life. Buyers come to find AI tools that help with writing, learning, money, home, health, hobbies, and travel — not work. The platform makes money via **subscription affiliate**: AgentFinder earns commission when buyers subscribe to a listed agent through an outbound link. Editorial independence is a load-bearing trust claim and is explicitly disclosed on the homepage.

**Target audience:** AI-curious individuals in their late 20s and up, using AI for personal life things outside of work. Mid-career-ish, tried ChatGPT, comfortable with technology but not developers, allergic to enterprise sales motions, attentive to honest peer-shaped reviews.

**Strategic anchors (from the original conversation that shaped the build):**
- Modeled loosely after Wirecutter's editorial-affiliate trust pattern, *not* Angi/Thumbtack's pay-per-lead marketplace model.
- Pay-per-lead is explicitly avoided by design — featured listings are flat-fee + time-boxed only.
- AI agents are *task-shaped products* (the buyer's mental sentence is "I want a tool that can [verb]"), unlike services where the category *is* the job. So the discovery flow is task-driven (search box first), with category browse as a secondary lane.

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
- **Deployed on Vercel** (Hobby tier) — production auto-deploys on every push to `main` (GitHub repo `maxwellfmorris/AgentFinder`). Two env vars set in Vercel: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Supabase is the hosted cloud project; migrations are run in its SQL editor. Live on the default `*.vercel.app` URL — a custom domain is owned but intentionally not connected yet.
- **No third-party** charting library, no third-party analytics SDK (PostHog, Mixpanel, Vercel Analytics, etc.). Everything telemetry-shaped lives in Supabase.
- **No LLM dependencies** in the codebase. Lexical search uses Postgres FTS. LLM-classified search is on the roadmap but not built.

### Runtime constraints

- **Repo path:** `/Users/sheamccusker/Desktop/MFMs Junk/VibeCoders/AgentFinder/` — must not contain an apostrophe. Next.js's metadata-route webpack loader doesn't escape apostrophes when interpolating absolute paths into error-message string literals, which breaks `npm run build`. (The folder was renamed from `MFM's Junk` → `MFMs Junk` to fix this.)
- **Dev server port:** usually `3000`. If a stale process is squatting, Next picks `3001`. Clean up with `lsof -ti:3000,3001 | xargs kill -9` from a separate terminal.
- **Supabase CLI is not wired up.** All migrations are applied manually by the user pasting SQL into the Supabase dashboard's SQL editor.
- **The user is a non-developer.** Recent work is done in Cowork: Claude edits the repo files directly and verifies with `npx tsc --noEmit` + `npx next lint` before handing off. The user then runs any SQL in the Supabase SQL editor and commits/pushes via their own terminal (push auto-deploys to Vercel). They prefer SQL pasted inline in chat, and clear labeling of which tool a command belongs in (Terminal vs Supabase) — conflating the two has caused errors.
- **Sandbox git quirk:** when Claude runs git operations from its sandbox, write conflicts sometimes leave a stale `.git/index.lock` file behind. The user clears it with `rm -f .git/index.lock` from their own terminal before retrying the commit.

---

## Directory structure (key folders only)

```
src/
├── app/
│   ├── page.tsx                       # Homepage — hero, search, categories, life-stage chips, featured, trust strip
│   ├── layout.tsx                     # Root layout — wraps everything in AuthProvider + Header
│   ├── sitemap.ts                     # SEO sitemap (per-agent URLs)
│   ├── robots.ts                      # SEO robots.txt
│   ├── agents/
│   │   ├── page.tsx                   # Browse — filters, search, sponsored-featured row, results grid via SearchResultLink
│   │   └── [slug]/page.tsx            # Agent detail — hero, Quick Tasks, About, At a Glance, Performance, Reviews, JSON-LD
│   ├── submit/
│   │   ├── page.tsx                   # /submit shell
│   │   ├── SubmitForm.tsx             # Smart import + 12-field manual form, controlled state for prefillable fields
│   │   └── actions.ts                 # submitAgent server action + prefillFromUrl server action (HTML scrape + SSRF defense)
│   ├── dashboard/
│   │   ├── page.tsx                   # /dashboard — async server component, gated by AuthProvider; shows per-listing status badge (pending/published)
│   │   └── feature-actions.ts         # purchaseFeature server action (auth + ownership check, sets featured_until/featured_tier)
│   └── feedback/
│       ├── page.tsx                   # /feedback — beta feedback page (linked in footer)
│       ├── FeedbackForm.tsx           # Client form: message + optional email; captures document.referrer as page_path
│       └── actions.ts                 # submitFeedback server action → feedback table
├── components/
│   ├── Header.tsx                     # Server component, includes NavAuthLinks for auth-aware nav
│   ├── NavAuthLinks.tsx               # Client island — renders the "Dashboard" link only when authed
│   ├── AuthProvider.tsx               # Context provider for the current user
│   ├── SignInModal.tsx                # Magic-link sign-in dialog
│   ├── AgentCard.tsx                  # The card shown in every grid; accepts optional onView prop for click logging
│   ├── TierChip.tsx                   # Colored chip showing trust_tier (Listed/Verified/Vetted/Audited)
│   ├── EvalRow.tsx                    # One eval benchmark row with letter-grade chip
│   ├── QuickTaskCard.tsx              # Pre-priced task tile (outbound link with UTM)
│   ├── ReviewForm.tsx                 # Review submission with usage_claim radio + months_used input
│   ├── ReviewsList.tsx                # Reviews display with "Verified user · paying · N months" chip
│   ├── ReviewsSection.tsx             # Wraps form + list with refresh-on-submit
│   ├── HomeSearch.tsx                 # Task-driven search input on the homepage
│   ├── SearchBar.tsx                  # The search box on /agents (separate from HomeSearch)
│   ├── SearchResultLink.tsx           # Wraps AgentCard for click-event logging on search-result clicks
│   ├── FilterSidebar.tsx              # Category / Pricing / For Who / Works With checkboxes (desktop sidebar + reused inside MobileFilters)
│   ├── MobileFilters.tsx             # Mobile-only "Filters" button + slide-in drawer wrapping FilterSidebar (lg:hidden); shows active-count badge
│   ├── DashboardCard.tsx              # Submitter-dashboard card: header, stats grid, sparkline, diagnostics
│   ├── DashboardSignInGate.tsx        # Unauthenticated /dashboard view
│   └── HowToClimbModal.tsx            # Modal listing all 4 trust tiers, current one highlighted
├── lib/
│   ├── supabase.ts                    # Simple anon server client (no cookies); for reads that don't need auth
│   ├── supabase-browser.ts            # createBrowserClient from @supabase/ssr; for client components
│   ├── supabase-server.ts             # createServerClient with cookies(); for getUser() + authenticated actions
│   ├── session.ts                     # getSessionId() — reads af_sid cookie set by middleware
│   ├── events.ts                      # logSearchEvent + logClickEvent (fire-and-forget; both server actions)
│   └── agents.ts                      # All data helpers + PLACEHOLDER_AGENTS dev fallback
├── types/
│   └── database.ts                    # All shared types: Agent, Review, AgentEval, AgentTask, SearchEvent, enums + label maps + helpers
└── middleware.ts                      # Sets httpOnly af_sid session cookie on every request that doesn't have one

supabase/
├── schema.sql                         # Canonical fresh-clone schema — kept in sync with migrations
├── seed.sql                           # OLD fictional 14-agent catalog — stale; live catalog is the 18 real agents (migrations 0014 + 0016). Don't re-run on prod.
├── seed_evals.sql                     # Sample evals for fictional agents — stale (those agents were deleted in 0015)
├── seed_tasks.sql                     # Sample Quick Tasks for fictional agents — stale (those agents were deleted in 0015)
└── migrations/                        # 17 numbered migrations, applied in order
    ├── 0000_reviews_table.sql         # The reviews table (originally created in dashboard, captured here)
    ├── 0001_review_rating_trigger.sql # Trigger that recomputes agents.average_rating/review_count on review change
    ├── 0002_trust_tier.sql            # Replaces `verified bool` with `trust_tier` enum
    ├── 0003_agent_evals.sql           # Eval scores table + RLS public-read
    ├── 0004_review_usage.sql          # Adds usage_claim + months_used to reviews
    ├── 0005_agent_owner.sql           # submitted_by_user_id FK to auth.users on delete set null
    ├── 0006_featured.sql              # featured_until + featured_tier columns + partial index
    ├── 0007_agent_tasks.sql           # Quick Tasks SKU table + RLS public-read
    ├── 0008_search_events.sql         # Telemetry table for both 'search' and 'click' event types
    ├── 0009_agents_search_vector.sql  # Generated tsvector column for Postgres FTS; drops the old functional index
    ├── 0010_remap_categories.sql      # Best-effort remap of business categories to consumer categories
    ├── 0011_consumer_catalog.sql      # Catalog migration: deletes 10 business agents, retags 8 dual-use, inserts 6 new
    ├── 0012_feedback.sql              # Beta feedback table + public-insert RLS
    ├── 0013_agent_status.sql          # Moderation gate: status column (pending/published/rejected); backfills existing → published
    ├── 0014_real_agents_seed.sql      # Seeds 12 real consumer AI products (published, trust_tier listed, no ratings)
    ├── 0015_remove_fictional_agents.sql # Deletes the 14 fictional example.com seed agents
    └── 0016_health_travel_agents.sql  # Adds 6 real agents to round out Health & Wellness (Ada Health, WHOOP, Headspace) + Travel (Hopper, GuideGeek, Wanderlog)
```

---

## Data flow

### Database tables (Supabase Postgres)

- **agents** — the catalog. Public-read (the app's read helpers expose only `status='published'` rows), public-insert via /submit (new submissions land as `pending`). Key columns: `id`, `slug` (unique), `name`, `tagline`, `description`, `category` (text matching `CATEGORIES` enum in TS), `industry_tags` text[] (life-stage tags), `platform_integrations` text[], `pricing_model` enum, `setup_complexity` enum, `trust_tier` enum, `average_rating` numeric(3,2), `review_count` int, `submitted_by_user_id` uuid FK auth.users, `featured_until` timestamptz, `featured_tier` text, `status` text ('pending'|'published'|'rejected', default 'pending'; migration 0013), `search_vector` tsvector (generated column).
- **reviews** — public-read, owner-write RLS. Columns include `agent_id`, `user_id`, `user_email`, `rating` (1-5), `body`, `usage_claim` ('paying'|'free_trial'|'evaluating'|'none'), `months_used`. Trigger recomputes `agents.average_rating` and `agents.review_count` on any change.
- **agent_evals** — public-read RLS. Stores standardized benchmark scores per agent: `benchmark_name`, `score` (0-100), `sample_size`, `notes`, `verified_by` ('self_reported'|'agentfinder'|'third_party'). Letter grade is computed in TS via `getLetterGrade()`, NOT stored.
- **agent_tasks** — public-read RLS. Quick Tasks SKUs: `title`, `description`, `price_usd`, `expected_duration_minutes`, `available` bool. Partial index on `(agent_id) where available = true`.
- **search_events** — public-insert RLS, no select policy (reads happen via SQL editor). Both 'search' and 'click' event types in one wide-nullables table. Foreign-keyed to agents on delete cascade.
- **feedback** — beta feedback. Public-insert RLS, no select policy (reads via SQL editor). Columns: `message`, `email` (nullable), `page_path` (nullable, captured from `document.referrer`), `session_id`, `user_id` (nullable FK auth.users on delete set null). Written by the `submitFeedback` server action from `/feedback`. Migration 0012.

### Three Supabase clients

The codebase has three different Supabase clients, each for a different purpose. Don't conflate them:

1. **`lib/supabase.ts` → `getSupabaseClient()`** — the simple anon client. Used for reads that don't need to know who the user is. Returns null if env vars aren't set (dev-without-Supabase mode).
2. **`lib/supabase-browser.ts` → `getSupabaseBrowser()`** — `createBrowserClient` from `@supabase/ssr`. Used inside client components for live auth state and writes-as-current-user.
3. **`lib/supabase-server.ts` → `getSupabaseServer()`** — `createServerClient` from `@supabase/ssr` with `cookies()` from next/headers. Used in server actions and async server components when you need to read the current user (`auth.getUser()`) or write rows on behalf of an authenticated user.

The cookie-set/setAll plumbing in `supabase-server.ts` includes an empty try/catch around the set call — that's the documented `@supabase/ssr` pattern. The error it swallows is the expected "cannot modify cookies in a read-only context" thrown when this client is invoked from a pure Server Component.

### Telemetry flow

1. Middleware (`src/middleware.ts`) runs on every non-asset request. If there's no `af_sid` cookie, it generates a UUID and sets one (httpOnly, SameSite=Lax, 1-year maxAge).
2. `lib/session.ts → getSessionId()` reads that cookie from `next/headers`. Returns `'unset'` as a fallback for the very-first-request edge case before middleware has had a chance to set it (rare; filter out `'unset'` rows in analytics).
3. `lib/events.ts → logSearchEvent` is called from `/agents` server component when `searchParams.q` is present. Fire-and-forget, never awaited.
4. `lib/events.ts → logClickEvent` is called from `SearchResultLink.tsx`'s `onClick` handler when a search result is clicked. Fire-and-forget. Only fires when `query` is non-null (i.e. only on search-driven clicks, never on category-only browsing).
5. Both functions wrap their Supabase insert in try/catch and swallow errors silently — telemetry failures must never crash user flow.

### Search

- **Lexical search via Postgres FTS.** `agents.search_vector` is a generated tsvector column over `name || ' ' || tagline || ' ' || description` using the `english` config. Indexed with GIN.
- `getAgents({ search: q })` in `lib/agents.ts` calls `.textSearch('search_vector', q, { type: 'plain', config: 'english' })`.
- The dev fallback (`filterLocally`) uses a tokenize + naive plural-stripping heuristic to approximate the same behavior.
- **Known stemmer blind spot:** Snowball stems "summarize" → `summar` and "summary" → `summari` — different stems. So `?q=summarize+meetings` returns no results even though MeetingMind has "summary" in its description. **This is accepted, not a bug.** The empty-result rows in `search_events` are the data point that will justify upgrading to LLM-classified search later.

### Moderation gate (submission review)

Self-submitted agents do not auto-publish. `agents.status` is `'pending' | 'published' | 'rejected'`, defaulting to `pending` for new submissions (migration `0013`, which backfilled all pre-existing agents to `published`). The public read helpers in `lib/agents.ts` (`getAgents`, `getAgentBySlug`, `getFeaturedAgents`) all filter `.eq('status', 'published')`, so a pending agent never appears in browse, search, on detail pages, on the homepage, or in the sitemap. The owner dashboard query is intentionally NOT status-filtered — submitters see their own pending listings with a status badge. Approval is **manual**: flip `status` to `'published'` via SQL. The `/submit` success copy says the agent is "in the review queue," not live.

### Feedback

`/feedback` (linked in the footer) is a beta feedback channel. `FeedbackForm.tsx` (client) collects a message + optional email and captures `document.referrer` as `page_path`; the `submitFeedback` server action writes to the `feedback` table with the session id and (if signed in) user id. Same RLS-public-insert, swallow-errors pattern as telemetry. Read submissions via the Supabase SQL editor.

### Trust ladder

Defined in `src/types/database.ts`:

- **`listed`** — Submitted by the team. Information is self-reported.
- **`verified`** — We've confirmed ownership and that the listing is accurate.
- **`vetted`** — Verified, plus 10+ verified-user reviews and a published eval score.
- **`audited`** — Vetted, plus an independent integration & security review in the last 12 months.

These strings are user-facing on the homepage trust strip, the agent detail page's "At a Glance" panel, and the "How to climb" modal. They are *deliberately falsifiable* — each rung is a climbable bar, not vague trust theater.

Tier promotion is currently **manual** (set via SQL). The dashboard's "What's hurting you" diagnostics describe the path but don't auto-promote. Tier eligibility being independent of affiliate-partner status is a load-bearing claim — never wire those together.

### Featured listings (paid placement)

`featured_until` + `featured_tier` columns on agents. `featured_tier` is `'none' | 'category' | 'homepage'`. Hardcoded design rules:

- **Flat-fee, time-boxed only.** No per-impression billing, no per-click tracking columns or code paths.
- **Visually disclosed.** Every featured card on the homepage and on category-filtered `/agents` views renders a lowercase `sponsored` label (text-slate-400, 11px, no border, no decoration). The label string is exactly "sponsored" — never "Featured" or "Promoted", which obscure the paid nature.
- **Independent of trust_tier.** Buying placement does not auto-climb tiers. A `listed` agent can buy homepage placement.
- The `purchaseFeature` server action verifies the caller owns the agent (`submitted_by_user_id === auth.uid()`) before allowing the update.

### Affiliate model (Phase 3 — not yet built)

Not implemented in code yet but the trust strip on the homepage already discloses it:

> "Reviews come from verified users — never paid, never editorialized. We earn a commission when you subscribe to an agent, but that never affects our rankings or trust tiers."

Phase 3 will add an `affiliate_url` column on agents and update outbound CTAs to use it when present. Click-through attribution will extend the existing `search_events` table (or a sibling table).

---

## Conventions and rules

### Migrations

- Always wrap in `begin; ... commit;`.
- Always idempotent: `create table if not exists`, `create index if not exists`, `add column if not exists`, `drop policy if exists` before `create policy`, `on conflict (slug) do nothing` on data inserts.
- For type creation: `do $$ begin ... exception when duplicate_object then null; end $$;` guard.
- `schema.sql` is kept in sync with migrations as the canonical fresh-clone artifact. Whenever a migration changes table shape, schema.sql is updated alongside.
- Migrations applied manually via Supabase SQL editor. Paste contents into a "New query", click Run.

### TypeScript

- **No `any` casts in new code.** The one pre-existing `// eslint-disable-next-line @typescript-eslint/no-explicit-any` on `supabase.from('...') as any` in `submitAgent` is legacy; don't propagate.
- The `Database` type in `src/types/database.ts` uses `& Record<string, unknown>` widening on each table's `Row`/`Insert`/`Update`. This is intentional — it absorbs the friction between application types and the supabase-js generic constraints. Don't remove it.
- The `Relationships: []` field on each `Database.Tables` entry is required by `@supabase/ssr`'s generics. Don't remove.

### Components

- Server components by default. Add `'use client'` only when you need state, hooks, or browser-only APIs.
- The `Header` is a server component. Its auth-aware Dashboard link lives in `NavAuthLinks.tsx` — a small client island. This pattern (server shell + client island) is preferred over making whole components client.
- `AgentCard` takes an optional `onView` prop that's attached to the "View Details" Link's `onClick`. The existing call sites that don't pass `onView` (homepage, sponsored row, dashboard) work unchanged.
- The wrapper `SearchResultLink` exists to log clicks without nesting anchors. AgentCard already contains the View Details Link and an external website link — wrapping the whole card in another Link would produce doubly-nested anchors (invalid HTML).

### Telemetry

- Fire-and-forget. Never await `logSearchEvent` or `logClickEvent` in user flow.
- `try/catch` swallows errors *inside* events.ts. Call sites still add a defensive `.catch(() => {})` as belt-and-suspenders.
- The `session_id` is the cookie value, never PII.

### Reviews

- Reviews are user-generated. AgentFinder never editorializes them.
- The "verified user" chip on reviews is computed from `usage_claim === 'paying' || 'free_trial'` via the `isVerifiedUsage()` helper in `types/database.ts`.
- The agent detail page hero shows the **verified-user average as the primary number**, with the all-reviews average as a small footnote. This visual hierarchy is intentional and must not be reversed.

### JSON-LD on agent detail pages

- The detail page renders a minimal `SoftwareApplication` schema.org JSON-LD blob: `name`, `description`, `url`, `applicationCategory`, optional `aggregateRating` (using the all-reviews number), `offers`.
- **DO NOT** add new fields to this blob. We've explicitly avoided adding `trust_tier`, eval scores, verified-user-subset reviews, Product schema for Quick Tasks, or affiliate-relationship fields. Self-asserted claims in structured data are dicey.

### Affiliate / editorial independence

- The trust strip on the homepage explicitly claims editorial independence ("We earn a commission when you subscribe to an agent, but that never affects our rankings or trust tiers"). This is a load-bearing trust claim with the late-20s+ AI-curious cohort.
- Featured placement is the *only* disclosed paid lane. Everything outside featured slots must remain editorially independent of affiliate revenue.
- Tier criteria do not reference affiliate-partnership status. A tier earned by an affiliate partner looks identical to one earned by a non-partner.

### Things explicitly never to do

- Don't introduce a pay-per-lead, per-impression, or per-click billing mechanism for featured listings.
- Don't add a third-party analytics SDK (PostHog, Mixpanel, Vercel Analytics, Amplitude, etc.). Telemetry stays in the `search_events` table.
- Don't add a third-party HTML parsing or fetching library (cheerio, jsdom) to the smart-import flow. Native `fetch` + regex only.
- Don't add a third-party charting/data-viz library. The dashboard sparkline is inline SVG by design.
- Don't add an "anonymous mode" toggle to `/submit`. Ownership is automatic when the submitter is authenticated, absent when not.
- Don't conflate `featured_tier` with `trust_tier`. They serve different purposes and must remain independent.
- Don't dress up the "sponsored" label as "Featured" or "Promoted" anywhere it appears.

---

## Current state

### What's working end-to-end

- **Trust ladder (P1)** — 4-tier system with falsifiable rung descriptions, surfaced on cards, detail pages, "How to climb" modal.
- **Evals (P2)** — `agent_evals` table, Performance section on detail pages, letter-grade chips (A=emerald, B=green, C=amber, D=orange, F=red), seeded with sample evals on a few agents.
- **Verified-usage reviews (P3)** — usage_claim radio in ReviewForm, "Verified user · paying · N months" chip in ReviewsList, dual-average display in the detail-page hero.
- **Smart import (P4)** — paste-a-URL prefill on `/submit` via the `prefillFromUrl` server action. SSRF defense, 5s timeout, content-type check, HTML entity decoding, relative URL resolution, edit-clears-chip UX.
- **Submitter dashboard (P5)** — `/dashboard` route, sign-in gate, per-agent cards with stats / sparkline / diagnostics / "Promote this listing" button / "How to climb" link.
- **Featured listings (P6)** — flat-fee paid placement, `purchaseFeature` server action with ownership check, "sponsored" label on featured cards.
- **Quick Tasks (P7)** — pre-priced atomic SKUs, rendered as a section inside the main agent card on detail pages. Outbound link with UTM tracking, no payment infrastructure yet.
- **Search + telemetry (P8)** — task-driven HomeSearch on the homepage, Postgres FTS via tsvector, search-event and click-event logging via the cookie-based session.
- **Consumer pivot (Phase 1 / 2a / 2b / 2c)** — voice, taxonomy, catalog, and life-stage UI all consumer-shaped.
- **Live deployment (Week 1)** — deployed on Vercel, auto-deploying from `main`. Submit flow + RLS verified in production.
- **Feedback path (Week 1)** — `/feedback` page, footer link, `feedback` table.
- **Moderation gate (Week 2)** — `status` column; public reads gated to `published`; submissions land `pending`; dashboard shows per-listing status; submit copy reflects review.
- **Real catalog (Week 2)** — 12 real, current consumer AI products seeded (`published`, `listed` tier, no fabricated ratings); all 14 fictional placeholders removed; homepage now pulls real published agents. Later expanded to **18** via migration 0016 (6 added to the two thinnest categories).
- **Pivot cleanup (Week 2)** — site metadata refreshed to consumer voice; dead "Meetings"/"Analytics" header nav links repointed to live categories (Money, Learning).
- **Mobile filtering** — Browse (`/agents`) filter sidebar is `hidden lg:block`; on mobile a `MobileFilters` "Filters" button + slide-in drawer (reusing `FilterSidebar`) exposes the full filter set. Resolves the old gap where phone users could only keyword-search.

### Current catalog (18 real agents)

All seeded `trust_tier: listed`, `status: published`, `average_rating: null`, `review_count: 0` (no fabricated ratings on real products — they earn reviews over time). Logos are neutral DiceBear placeholders, not the companies' real logos (avoids implying endorsement). Descriptions are original, written from each product's public site.

| Slug | Name | Category | Pricing |
|---|---|---|---|
| grammarly | Grammarly | Writing & Communication | freemium |
| wordtune | Wordtune | Writing & Communication | freemium |
| khanmigo | Khanmigo | Learning & Skills | freemium |
| duolingo | Duolingo | Learning & Skills | freemium |
| cleo | Cleo | Money & Finances | freemium |
| copilot-money | Copilot Money | Money & Finances | subscription |
| ohai-ai | Ohai.ai | Home & Family | subscription |
| samsung-food | Samsung Food | Home & Family | freemium |
| wysa | Wysa | Health & Wellness | freemium |
| ada-health | Ada Health | Health & Wellness | free |
| whoop | WHOOP | Health & Wellness | subscription |
| headspace | Headspace | Health & Wellness | subscription |
| midjourney | Midjourney | Hobbies & Creative | subscription |
| suno | Suno | Hobbies & Creative | freemium |
| mindtrip | Mindtrip | Travel & Planning | freemium |
| hopper | Hopper | Travel & Planning | free |
| guidegeek | GuideGeek | Travel & Planning | free |
| wanderlog | Wanderlog | Travel & Planning | freemium |

Full descriptions/taglines for the first 12 live in `REAL_AGENTS_DRAFT.md` at the repo root; the 6 added in 0016 live in that migration file. Listing real products needs no permission (nominative fair use); *monetizing* via affiliate requires joining each product's program (a Phase 3 step). Per-category counts are now: Writing 2, Learning 2, Money 2, Home 2, Health & Wellness 4, Hobbies 2, Travel & Planning 4.

### Current categories (7)

`Writing & Communication`, `Learning & Skills`, `Money & Finances`, `Home & Family`, `Health & Wellness`, `Hobbies & Creative`, `Travel & Planning`. Defined in `CATEGORIES` const in `src/types/database.ts`.

### Current life-stage tags (12)

`Parents`, `New Parents`, `Students`, `Adult Learners`, `Renters`, `Job Seekers`, `Hobbyists`, `Creators`, `Caregivers`, `Travelers`, `Couples`, `Quantified-Self`. Defined in `LIFE_STAGE_TAGS` const. Surfaced as a 10-chip row on the homepage and a "For Who" filter section on `/agents`.

### Design system — "Sunset Pop" (DONE, shipped across all surfaces)

The aesthetic was intentionally simple; the user wanted it more eye-catching. We mocked 3 homepage directions, the user picked **Direction B (Bold Pop)**, then chose the **B2 "Sunset Pop"** sub-variant as the final look. The system: warm-cream page (`#FFF9F4`), a coral→pink→violet hero gradient (`#FF6B4A → #FF3D77 → #8B2FE6`) with rounded-bottom corners and soft decorative circles, **buttercream `#FFD23D`** as the primary CTA/accent, **Space Grotesk** for display/headlines + **Inter** for body, ink text `#2A1A2E`, and soft pillowy cards (no hard borders; gentle colored shadows; colored top-accent bar). Tokens live in `tailwind.config.ts` (`cream`, `ink`, `coral`, `punch`, `grape`, `butter`, `muted`) + `fontFamily.sans`/`fontFamily.display`; fonts loaded via `next/font` in `layout.tsx`; page bg/foreground in `globals.css`.

Converted surfaces (every page + shared component): homepage, AgentCard, Header/footer, NavAuthLinks, HomeSearch; Browse (`/agents`) + FilterSidebar + SearchBar; detail (`/agents/[slug]`) + ReviewsSection/ReviewForm/ReviewsList/QuickTaskCard/EvalRow/SignInModal; Submit + SubmitForm; Dashboard + DashboardCard/DashboardSignInGate/HowToClimbModal; Feedback + FeedbackForm. **Zero `indigo-*` classes remain in `src/`.** Intentionally kept as semantic (not brand) colors: trust-tier chips (`listed`=neutral slate, `verified`=grape, `vetted`=emerald, `audited`=amber in `TIER_COLORS`), letter-grade colors, pricing/complexity badges, amber rating stars + neutral `slate-200` empty stars, emerald success / red error / amber "promote"/issues states, neutral slate for `enterprise` pricing + "Not approved" status. Also fixed lingering business-voice copy on Browse + Submit (no more "for your team / business professionals"; Submit's old "Industry tags" field is now "Who it's for" with life-stage examples). All changes pass `tsc --noEmit` + `next lint`, and are **shipped to GitHub/Vercel and live**. (Two throwaway mockup files at the repo root — `homepage-redesign-mockups.html`, `homepage-bold-variations.html` — were removed in a cleanup commit.)

### What's next (not yet built)

- **Mobile category-chips row (optional follow-on).** A horizontal-scroll row of category chips at the top of mobile Browse for one-tap filtering, complementing the existing `MobileFilters` drawer. Discussed, not built.
- **Phase 3 — Affiliate-link infrastructure.** Add `affiliate_url` column to agents, update outbound CTAs ("Visit Website" on detail pages, "Run this task" in Quick Tasks) to use the affiliate URL when present, log click-throughs with affiliate attribution. The load-bearing piece that turns the consumer pivot into actual revenue.
- **Phase 4 — Comparison surface.** Side-by-side compare page, "vs alternatives" link on detail pages. Higher value with the AI-curious cohort.
- **Phase 5 — SEO + editorial content.** Programmatic `/best/{category}` pages, write-ups. Bigger lift.
- **LLM-classified search.** After 2-3 weeks of `search_events` data, decide whether to upgrade from lexical FTS to LLM-classified search. The Snowball stemmer's blind spots will be visible in the zero-result rows.

### Known debt (non-blocking)

- `schema.sql`'s top drop-list is missing entries for `agent_tasks`, `agent_evals`, `search_events`. Fresh-clone bootstrap from `schema.sql` alone would fail to drop those tables before recreating. Cosmetic; the migrations are the operational source of truth.
- `AuthProvider.tsx`, `ReviewsList.tsx`, `SignInModal.tsx` each have a single `react-hooks/exhaustive-deps` warning. Pre-existing, non-blocking. Worth a cleanup pass eventually.
- `PLACEHOLDER_AGENTS` in `lib/agents.ts` still holds the 5 OLD fictional entries (Draftly / BudgetSense / MealMate / DayPulse / Journie). It's now used *only* as the dev-without-Supabase fallback — the homepage no longer displays it. Stale but harmless; worth swapping for a couple of real entries eventually.
- The smart-import server action does a full `.text()` then `.slice(0, 200 * 1024)` — the body is downloaded entirely before truncation. The 5s timeout is the actual hostile-input protection. Worth switching to streaming if it becomes a hotspot.
- Two emoji collisions on the homepage are kept *by design* as semantic anchors: 🏠 appears on both the "Home & Family" category tile and the "Renters" chip; ✈️ on both "Travel & Planning" and "Travelers". Documented and accepted.
- Life-stage chip coverage shifted with the new real catalog (per-chip agent counts are no longer those in this doc). Some chips match few or no agents until the catalog grows. Not a bug.
- The homepage "A few to get you started" row shows the first 3 published agents by `review_count` desc — with every real agent at 0 reviews, that ordering is effectively arbitrary for now. Fine until there are real ratings or curated featured picks.

### Working rhythm

The recent working loop (in Cowork):
1. The user brings a strategic question or a goal; we align on direction first — often via multiple-choice clarifying questions — before any code.
2. Claude edits the repo files directly (Read/Write/Edit), keeping changes small and matching existing patterns.
3. Claude verifies every change with `npx tsc --noEmit` and `npx next lint --file ...` before handing off — both must be clean (unescaped apostrophes in JSX and unused imports will fail the Vercel build).
4. Claude pastes any SQL migration inline in chat, clearly labeled "in the Supabase SQL editor," for the user to run.
5. Claude gives exact `git` commands, clearly labeled "in your Terminal," to commit + push; pushing auto-deploys to Vercel.
6. The user runs a smoke test (visual + an SQL `SELECT`) and reports back; Claude marks the step done.

(Earlier in the project the loop ran through Claude Code with pasted prompts — that still works, but recent sessions edit directly via Cowork. Claude cannot push from its sandbox; the user always runs git from their own terminal.)

**Cadence preferences:**
- One reviewable step at a time; the user often says "slow and steady." Big changes are split into sub-steps, each verified before the next.
- Commands are labeled by tool (Terminal vs Supabase) — conflating them has caused errors (e.g. pasting a `cat … | pbcopy` line into the SQL editor).
- Destructive actions (deletes, drops) are confirmed before running.
- A running task list tracks multi-step work so the user can see progress.

---

## How to get oriented quickly

If you're a fresh Claude reading this for the first time:

1. **Skim this file.** Especially the "What this is" section (strategic anchors), the conventions, and "What's next".
2. **Read `src/types/database.ts`** to get the data model in one place: enums, interfaces, label maps, helper functions. It's the densest file in the project for understanding the domain.
3. **Read `src/lib/agents.ts`** for the data-access patterns: `getAgents`, `getAgentBySlug`, `getFeaturedAgents`, `getLatestEvalsForAgent`, `getReviewStatsForAgent`, `getReviewCountSparkline`, `getTasksForAgent`. These are the canonical query helpers.
4. **Skim `src/app/page.tsx`** for the homepage structure and what the buyer sees first.
5. **Run `git log --oneline -15`** to see the recent prompt-commits in order — the messages are descriptive enough to reconstruct the rough build sequence.

You should then be able to pick up a strategic conversation or a new prompt without rescanning the codebase. If the user asks you to verify a prompt they just ran, the routine is: `git diff HEAD --stat`, then `git diff HEAD -- <file>` for each file of interest, then walk them through a smoke test.
