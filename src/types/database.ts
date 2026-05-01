export type PricingModel = 'free' | 'freemium' | 'subscription' | 'usage_based' | 'enterprise'
export type SetupComplexity = 'plug_and_play' | 'low' | 'medium' | 'high'

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
  verified: boolean
  average_rating: number | null
  review_count: number
}

export interface Review {
  id: string
  created_at: string
  agent_id: string
  user_id: string
  user_email: string
  rating: number
  body: string
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
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      pricing_model: PricingModel
      setup_complexity: SetupComplexity
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
