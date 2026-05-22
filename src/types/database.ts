export type PricingModel = 'free' | 'freemium' | 'subscription' | 'usage_based' | 'enterprise'
export type SetupComplexity = 'plug_and_play' | 'low' | 'medium' | 'high'
export type TrustTier = 'listed' | 'verified' | 'vetted' | 'audited'
export type FeaturedTier = 'none' | 'category' | 'homepage'
export type AgentStatus = 'pending' | 'published' | 'rejected'

export interface Agent {
  id: string
  created_at: string
  name: string
  slug: string
  tagline: string
  description: string
  website: string | null
  logo_url: string | null
  category: string
  industry_tags: string[]
  platform_integrations: string[]
  pricing_model: PricingModel
  setup_complexity: SetupComplexity
  trust_tier: TrustTier
  average_rating: number | null
  review_count: number
  submitted_by_user_id: string | null
  featured_until: string | null
  featured_tier: FeaturedTier
  status: AgentStatus
}

export function isFeatured(agent: { featured_until: string | null }): boolean {
  return agent.featured_until !== null && new Date(agent.featured_until) > new Date()
}

export type UsageClaim = 'paying' | 'free_trial' | 'evaluating' | 'none'

export const USAGE_CLAIM_LABELS: Record<UsageClaim, string> = {
  paying: 'Paying user',
  free_trial: 'On a free trial',
  evaluating: 'Evaluating',
  none: 'Have not used',
}

export function isVerifiedUsage(claim: UsageClaim): boolean {
  return claim === 'paying' || claim === 'free_trial'
}

export interface Review {
  id: string
  created_at: string
  agent_id: string
  user_id: string
  user_email: string
  rating: number
  body: string
  usage_claim: UsageClaim
  months_used: number | null
}

export interface AgentTask {
  id: string
  created_at: string
  agent_id: string
  title: string
  description: string
  price_usd: number
  expected_duration_minutes: number | null
  available: boolean
}

export type VerifiedBy = 'self_reported' | 'agentfinder' | 'third_party'
export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F'

export interface AgentEval {
  id: string
  created_at: string
  agent_id: string
  benchmark_name: string
  score: number
  sample_size: number | null
  notes: string | null
  evaluated_at: string
  verified_by: VerifiedBy
}

export const VERIFIED_BY_LABELS: Record<VerifiedBy, string> = {
  self_reported: 'Self-reported',
  agentfinder: 'AgentFinder verified',
  third_party: 'Third-party',
}

export const GRADE_COLORS: Record<LetterGrade, string> = {
  A: 'bg-emerald-100 text-emerald-700',
  B: 'bg-green-100 text-green-700',
  C: 'bg-amber-100 text-amber-700',
  D: 'bg-orange-100 text-orange-700',
  F: 'bg-red-100 text-red-700',
}

export function getLetterGrade(score: number): LetterGrade {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

export interface SearchEvent {
  id: string
  created_at: string
  event_type: 'search' | 'click'
  session_id: string
  user_id: string | null
  query: string
  result_count: number | null
  agent_id: string | null
  position: number | null
}

export interface Feedback {
  id: string
  created_at: string
  message: string
  email: string | null
  page_path: string | null
  session_id: string
  user_id: string | null
}

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: Agent & Record<string, unknown>
        Insert: Omit<Agent, 'id' | 'created_at'> & Record<string, unknown>
        Update: Partial<Omit<Agent, 'id' | 'created_at'>> & Record<string, unknown>
        Relationships: []
      }
      reviews: {
        Row: Review & Record<string, unknown>
        Insert: Omit<Review, 'id' | 'created_at'> & Record<string, unknown>
        Update: Partial<Omit<Review, 'id' | 'created_at'>> & Record<string, unknown>
        Relationships: []
      }
      agent_evals: {
        Row: AgentEval & Record<string, unknown>
        Insert: Omit<AgentEval, 'id' | 'created_at'> & Record<string, unknown>
        Update: Partial<Omit<AgentEval, 'id' | 'created_at'>> & Record<string, unknown>
        Relationships: []
      }
      agent_tasks: {
        Row: AgentTask & Record<string, unknown>
        Insert: Omit<AgentTask, 'id' | 'created_at'> & Record<string, unknown>
        Update: Partial<Omit<AgentTask, 'id' | 'created_at'>> & Record<string, unknown>
        Relationships: []
      }
      search_events: {
        Row: SearchEvent & Record<string, unknown>
        Insert: Omit<SearchEvent, 'id' | 'created_at'> & Record<string, unknown>
        Update: Partial<Omit<SearchEvent, 'id' | 'created_at'>> & Record<string, unknown>
        Relationships: []
      }
      feedback: {
        Row: Feedback & Record<string, unknown>
        Insert: Omit<Feedback, 'id' | 'created_at'> & Record<string, unknown>
        Update: Partial<Omit<Feedback, 'id' | 'created_at'>> & Record<string, unknown>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      pricing_model: PricingModel
      setup_complexity: SetupComplexity
      trust_tier: TrustTier
    }
  }
}

export const CATEGORIES = [
  'Writing & Communication',
  'Learning & Skills',
  'Money & Finances',
  'Home & Family',
  'Health & Wellness',
  'Hobbies & Creative',
  'Travel & Planning',
] as const

export const PRICING_LABELS: Record<PricingModel, string> = {
  free: 'Free',
  freemium: 'Freemium',
  subscription: 'Subscription',
  usage_based: 'Pay-as-you-go',
  enterprise: 'Enterprise',
}

export const COMPLEXITY_LABELS: Record<SetupComplexity, string> = {
  plug_and_play: 'Plug & Play',
  low: 'Easy Setup',
  medium: 'Some Setup',
  high: 'Technical Setup',
}

export const COMPLEXITY_DESCRIPTIONS: Record<SetupComplexity, string> = {
  plug_and_play: 'Ready in under 5 minutes',
  low: 'Up and running in an afternoon',
  medium: 'A bit of setup, but worth it',
  high: 'Technical — best for power users',
}

export const TIER_LABELS: Record<TrustTier, string> = {
  listed: 'Listed',
  verified: 'Verified',
  vetted: 'Vetted',
  audited: 'Audited',
}

export const TIER_DESCRIPTIONS: Record<TrustTier, string> = {
  listed: 'Submitted by the team. Information is self-reported.',
  verified: "We've confirmed ownership and that the listing is accurate.",
  vetted: 'Verified, plus 10+ verified-user reviews and a published eval score.',
  audited: 'Vetted, plus an independent integration & security review in the last 12 months.',
}

export const TIER_COLORS: Record<TrustTier, string> = {
  listed: 'bg-slate-100 text-slate-700',
  verified: 'bg-indigo-100 text-indigo-700',
  vetted: 'bg-emerald-100 text-emerald-700',
  audited: 'bg-amber-100 text-amber-800',
}

export const LIFE_STAGE_TAGS = [
  'Parents',
  'New Parents',
  'Students',
  'Adult Learners',
  'Renters',
  'Job Seekers',
  'Hobbyists',
  'Creators',
  'Caregivers',
  'Travelers',
  'Couples',
  'Quantified-Self',
] as const

export const POPULAR_INTEGRATIONS = [
  'Gmail',
  'Outlook',
  'Apple Mail',
  'Google Calendar',
  'Apple Calendar',
  'Slack',
  'Discord',
  'WhatsApp',
  'Notion',
  'Google Drive',
  'Dropbox',
  'Google Sheets',
  'Excel',
  'Spotify',
  'Apple Health',
  'Strava',
] as const
