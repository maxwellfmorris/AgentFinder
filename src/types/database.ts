export type PricingModel = 'free' | 'freemium' | 'subscription' | 'usage_based' | 'enterprise'
export type SetupComplexity = 'plug_and_play' | 'low' | 'medium' | 'high'
export type TrustTier = 'listed' | 'verified' | 'vetted' | 'audited'

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

export function getLetterGrade(score: number): LetterGrade {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: Agent
        Insert: Omit<Agent, 'id' | 'created_at'>
        Update: Partial<Omit<Agent, 'id' | 'created_at'>>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at'>
        Update: Partial<Omit<Review, 'id' | 'created_at'>>
      }
      agent_evals: {
        Row: AgentEval
        Insert: Omit<AgentEval, 'id' | 'created_at'>
        Update: Partial<Omit<AgentEval, 'id' | 'created_at'>>
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
  'Productivity & Meetings',
  'Data & Analytics',
  'HR & Recruiting',
  'Customer Success',
  'Sales',
  'Finance',
  'Legal',
  'Marketing',
  'IT & Security',
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
  medium: 'May need IT help',
  high: 'Requires a developer',
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

export const POPULAR_INTEGRATIONS = [
  'Gmail',
  'Outlook',
  'Slack',
  'Notion',
  'Zoom',
  'Google Meet',
  'Microsoft Teams',
  'Salesforce',
  'HubSpot',
  'Jira',
  'Google Sheets',
  'Excel',
  'Airtable',
  'Zendesk',
  'LinkedIn',
] as const
