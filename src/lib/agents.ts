import { getSupabaseClient } from './supabase'
import type { Agent, AgentEval, PricingModel, TrustTier, UsageClaim } from '@/types/database'
import { isVerifiedUsage } from '@/types/database'

export const PLACEHOLDER_AGENTS: Agent[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    name: 'Draftly',
    slug: 'draftly',
    tagline: 'Turn your bullet points into polished emails in seconds',
    description:
      "Draftly is an AI writing assistant that transforms rough notes into professional emails, proposals, and reports. Perfect for busy executives and account managers who need to communicate clearly without spending hours writing. It learns your tone over time and adapts to your industry's language.",
    website: 'https://example.com/draftly',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=draftly&backgroundColor=dbeafe',
    category: 'Writing & Communication',
    industry_tags: ['Sales', 'Marketing', 'Executive'],
    platform_integrations: ['Gmail', 'Outlook', 'Slack', 'Notion'],
    pricing_model: 'freemium',
    setup_complexity: 'plug_and_play',
    trust_tier: 'vetted' as TrustTier,
    average_rating: 4.7,
    review_count: 214,
    submitted_by_user_id: null,
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    name: 'MeetingMind',
    slug: 'meetingmind',
    tagline: 'Never write meeting notes again',
    description:
      'MeetingMind joins your calls, transcribes the conversation, and delivers a clean summary with action items and decisions — directly to your inbox within minutes of hanging up. Trusted by operations teams, consultants, and project managers at over 500 companies.',
    website: 'https://example.com/meetingmind',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=meetingmind&backgroundColor=dcfce7',
    category: 'Productivity & Meetings',
    industry_tags: ['Consulting', 'Operations', 'HR', 'Legal'],
    platform_integrations: ['Zoom', 'Google Meet', 'Microsoft Teams', 'Notion', 'Jira'],
    pricing_model: 'subscription',
    setup_complexity: 'plug_and_play',
    trust_tier: 'audited' as TrustTier,
    average_rating: 4.5,
    review_count: 389,
    submitted_by_user_id: null,
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    name: 'DataNarrator',
    slug: 'data-narrator',
    tagline: 'Ask your spreadsheet a question, get a plain-English answer',
    description:
      'DataNarrator connects to your existing data sources and lets you ask questions in plain language — no SQL, no formulas. Get instant charts, summaries, and trend reports that you can share with your team. Ideal for business analysts and department heads who want insights without depending on the data team.',
    website: 'https://example.com/datanarrator',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=datanarrator&backgroundColor=fef9c3',
    category: 'Data & Analytics',
    industry_tags: ['Finance', 'Retail', 'Healthcare', 'Operations'],
    platform_integrations: ['Google Sheets', 'Excel', 'Airtable', 'Salesforce', 'HubSpot'],
    pricing_model: 'subscription',
    setup_complexity: 'low',
    trust_tier: 'verified' as TrustTier,
    average_rating: 4.3,
    review_count: 156,
    submitted_by_user_id: null,
  },
  {
    id: '4',
    created_at: new Date().toISOString(),
    name: 'HireAssist',
    slug: 'hire-assist',
    tagline: 'Screen 100 resumes while you take your lunch break',
    description:
      'HireAssist reviews incoming applications against your job description, scores candidates on fit, and drafts personalized outreach emails — all before you sit back down. Recruiters and HR teams use it to cut time-to-shortlist by 60% without sacrificing quality.',
    website: 'https://example.com/hireassist',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=hireassist&backgroundColor=fce7f3',
    category: 'HR & Recruiting',
    industry_tags: ['HR', 'Staffing', 'Tech', 'Finance'],
    platform_integrations: ['Greenhouse', 'Lever', 'Workday', 'LinkedIn', 'Gmail'],
    pricing_model: 'usage_based',
    setup_complexity: 'low',
    trust_tier: 'listed' as TrustTier,
    average_rating: 4.1,
    review_count: 78,
    submitted_by_user_id: null,
  },
  {
    id: '5',
    created_at: new Date().toISOString(),
    name: 'ClientPulse',
    slug: 'clientpulse',
    tagline: 'Know how your clients feel before they tell you',
    description:
      'ClientPulse monitors your email threads, support tickets, and CRM notes to flag accounts that show signs of churn risk or upsell opportunity. It surfaces the right client at the right moment so your team can act proactively. Built for customer success managers and account executives at B2B companies.',
    website: 'https://example.com/clientpulse',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=clientpulse&backgroundColor=ede9fe',
    category: 'Customer Success',
    industry_tags: ['SaaS', 'Professional Services', 'Finance'],
    platform_integrations: ['Salesforce', 'HubSpot', 'Zendesk', 'Gmail', 'Slack'],
    pricing_model: 'subscription',
    setup_complexity: 'medium',
    trust_tier: 'vetted' as TrustTier,
    average_rating: 4.6,
    review_count: 102,
    submitted_by_user_id: null,
  },
]

export interface AgentFilters {
  categories?: string[]
  pricingModels?: PricingModel[]
  integrations?: string[]
  search?: string
}

export async function getAgents(filters: AgentFilters = {}): Promise<Agent[]> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return filterLocally(PLACEHOLDER_AGENTS, filters)
  }

  try {
    let query = supabase.from('agents').select('*').order('review_count', { ascending: false })

    if (filters.categories?.length) {
      query = query.in('category', filters.categories)
    }
    if (filters.pricingModels?.length) {
      query = query.in('pricing_model', filters.pricingModels)
    }

    const { data, error } = await query

    if (error) throw error

    let results = data as Agent[]

    if (filters.integrations?.length) {
      results = results.filter((a) =>
        filters.integrations!.some((i) => a.platform_integrations.includes(i))
      )
    }

    if (filters.search) {
      const q = filters.search.toLowerCase()
      results = results.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.tagline.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      )
    }

    return results
  } catch {
    return filterLocally(PLACEHOLDER_AGENTS, filters)
  }
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return PLACEHOLDER_AGENTS.find((a) => a.slug === slug) ?? null
  }

  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) return null
    return data as Agent
  } catch {
    return PLACEHOLDER_AGENTS.find((a) => a.slug === slug) ?? null
  }
}

function filterLocally(agents: Agent[], filters: AgentFilters): Agent[] {
  let results = [...agents]

  if (filters.categories?.length) {
    results = results.filter((a) => filters.categories!.includes(a.category))
  }
  if (filters.pricingModels?.length) {
    results = results.filter((a) => filters.pricingModels!.includes(a.pricing_model))
  }
  if (filters.integrations?.length) {
    results = results.filter((a) =>
      filters.integrations!.some((i) => a.platform_integrations.includes(i))
    )
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    results = results.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.tagline.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    )
  }

  return results
}

export async function getLatestEvalsForAgent(agentId: string): Promise<AgentEval[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  try {
    const { data, error } = await supabase
      .from('agent_evals')
      .select('*')
      .eq('agent_id', agentId)
      .order('evaluated_at', { ascending: false })

    if (error || !data) return []

    // Dedupe by benchmark_name, keeping the most recent row (data is already sorted desc)
    const seen = new Set<string>()
    const latest: AgentEval[] = []
    for (const row of data as AgentEval[]) {
      if (!seen.has(row.benchmark_name)) {
        seen.add(row.benchmark_name)
        latest.push(row)
      }
    }
    return latest
  } catch {
    return []
  }
}

export interface ReviewStats {
  totalCount: number
  totalAvg: number | null
  verifiedCount: number
  verifiedAvg: number | null
}

export async function getReviewStatsForAgent(agentId: string): Promise<ReviewStats> {
  const empty: ReviewStats = { totalCount: 0, totalAvg: null, verifiedCount: 0, verifiedAvg: null }
  const supabase = getSupabaseClient()
  if (!supabase) return empty

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, rating, usage_claim')
      .eq('agent_id', agentId)

    if (error || !data) return empty

    const rows = data as { id: string; rating: number; usage_claim: UsageClaim }[]
    const totalCount = rows.length
    const totalAvg = totalCount > 0
      ? Math.round((rows.reduce((s, r) => s + r.rating, 0) / totalCount) * 100) / 100
      : null

    const verified = rows.filter((r) => isVerifiedUsage(r.usage_claim))
    const verifiedCount = verified.length
    const verifiedAvg = verifiedCount > 0
      ? Math.round((verified.reduce((s, r) => s + r.rating, 0) / verifiedCount) * 100) / 100
      : null

    return { totalCount, totalAvg, verifiedCount, verifiedAvg }
  } catch {
    return empty
  }
}

export async function getReviewCountSparkline(agentId: string, months = 6): Promise<number[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return Array<number>(months).fill(0)

  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - months)

  const { data, error } = await supabase
    .from('reviews')
    .select('created_at')
    .eq('agent_id', agentId)
    .gte('created_at', cutoff.toISOString())

  if (error || !data) return Array<number>(months).fill(0)

  const now = new Date()
  const buckets = Array<number>(months).fill(0)

  for (const row of data as { created_at: string }[]) {
    const d = new Date(row.created_at)
    const monthsAgo =
      (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
    const idx = months - 1 - monthsAgo
    if (idx >= 0 && idx < months) buckets[idx]++
  }

  return buckets
}
