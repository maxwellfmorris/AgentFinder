import { getSupabaseClient } from './supabase'
import type { Agent, AgentEval, AgentTask, FeaturedTier, PricingModel, TrustTier, UsageClaim } from '@/types/database'
import { isVerifiedUsage } from '@/types/database'

export const PLACEHOLDER_AGENTS: Agent[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    name: 'Draftly',
    slug: 'draftly',
    tagline: 'Turn your bullet points into polished messages in seconds',
    description:
      "Draftly transforms rough notes into polished emails, letters, and messages. Perfect for anyone who freezes up at a blank screen — writing to a landlord, drafting a difficult message to a relative, or crafting cover letters. It learns your tone over time and adapts to who you're writing to.",
    website: 'https://example.com/draftly',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=draftly&backgroundColor=dbeafe',
    category: 'Writing & Communication',
    industry_tags: ['Renters', 'Job Seekers', 'Caregivers', 'Anyone'],
    platform_integrations: ['Gmail', 'Outlook', 'Apple Mail', 'Notion'],
    pricing_model: 'freemium',
    setup_complexity: 'plug_and_play',
    trust_tier: 'vetted' as TrustTier,
    average_rating: 4.7,
    review_count: 214,
    submitted_by_user_id: null,
    featured_until: null,
    featured_tier: 'none' as FeaturedTier,
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    name: 'BudgetSense',
    slug: 'budget-sense',
    tagline: 'Know where your money goes — without spreadsheets',
    description:
      "BudgetSense connects to your bank and credit accounts, categorizes spending automatically, and shows you patterns you'd never spot manually. Alerts you when you're trending over budget. Helps you set realistic savings goals. Private by design — your data is never sold or used for ads.",
    website: 'https://example.com/budgetsense',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=budgetsense&backgroundColor=d1fae5',
    category: 'Money & Finances',
    industry_tags: ['New Parents', 'Renters', 'Anyone Budgeting'],
    platform_integrations: ['Apple Mail', 'Gmail', 'Google Sheets', 'Excel'],
    pricing_model: 'freemium',
    setup_complexity: 'low',
    trust_tier: 'verified' as TrustTier,
    average_rating: 4.5,
    review_count: 312,
    submitted_by_user_id: null,
    featured_until: null,
    featured_tier: 'none' as FeaturedTier,
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    name: 'MealMate',
    slug: 'meal-mate',
    tagline: "A week of dinners, planned around what's in your fridge",
    description:
      "MealMate tells you what to cook based on what you already have, your family's tastes, dietary restrictions, and how much time you have. Generates a shopping list for missing items. Adapts as you skip or swap meals. Cuts grocery waste and Wednesday-night \"what's for dinner\" stress.",
    website: 'https://example.com/mealmate',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=mealmate&backgroundColor=fee2e2',
    category: 'Home & Family',
    industry_tags: ['Parents', 'Home Cooks', 'Couples'],
    platform_integrations: ['Notion', 'Apple Calendar', 'Google Calendar'],
    pricing_model: 'freemium',
    setup_complexity: 'plug_and_play',
    trust_tier: 'verified' as TrustTier,
    average_rating: 4.7,
    review_count: 421,
    submitted_by_user_id: null,
    featured_until: null,
    featured_tier: 'none' as FeaturedTier,
  },
  {
    id: '4',
    created_at: new Date().toISOString(),
    name: 'DayPulse',
    slug: 'day-pulse',
    tagline: 'Track your mood and energy, spot what actually matters',
    description:
      'A daily two-minute check-in. Asks about your mood, sleep, energy, and what happened today. Surfaces weekly patterns — "you sleep better after walks," "your mood dips on Mondays." Privacy-first: your entries stay yours, never sold, never analyzed by humans.',
    website: 'https://example.com/daypulse',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=daypulse&backgroundColor=ede9fe',
    category: 'Health & Wellness',
    industry_tags: ['Quantified-Self', 'Mental Wellness', 'Sleep-Focused'],
    platform_integrations: ['Apple Health', 'Strava'],
    pricing_model: 'freemium',
    setup_complexity: 'plug_and_play',
    trust_tier: 'vetted' as TrustTier,
    average_rating: 4.4,
    review_count: 167,
    submitted_by_user_id: null,
    featured_until: null,
    featured_tier: 'none' as FeaturedTier,
  },
  {
    id: '5',
    created_at: new Date().toISOString(),
    name: 'Journie',
    slug: 'journie',
    tagline: 'A full trip itinerary in 5 minutes',
    description:
      "Tell Journie where you're going, when, and what you like. It generates a day-by-day itinerary with restaurants, activities, walking routes, and Google Maps links. Adjusts on the fly when your plans change. Perfect for travelers who hate planning but love a good trip.",
    website: 'https://example.com/journie',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=journie&backgroundColor=cffafe',
    category: 'Travel & Planning',
    industry_tags: ['Travelers', 'Vacationers', 'Digital Nomads'],
    platform_integrations: ['Google Calendar', 'Apple Calendar', 'Notion', 'WhatsApp'],
    pricing_model: 'freemium',
    setup_complexity: 'plug_and_play',
    trust_tier: 'verified' as TrustTier,
    average_rating: 4.3,
    review_count: 256,
    submitted_by_user_id: null,
    featured_until: null,
    featured_tier: 'none' as FeaturedTier,
  },
]

export interface AgentFilters {
  categories?: string[]
  pricingModels?: PricingModel[]
  integrations?: string[]
  industries?: string[]
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
    if (filters.industries?.length) {
      query = query.overlaps('industry_tags', filters.industries)
    }
    if (filters.search) {
      query = query.textSearch('search_vector', filters.search, {
        type: 'plain',
        config: 'english',
      })
    }

    const { data, error } = await query

    if (error) throw error

    let results = data as Agent[]

    if (filters.integrations?.length) {
      results = results.filter((a) =>
        filters.integrations!.some((i) => a.platform_integrations.includes(i))
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

export async function getFeaturedAgents(opts: {
  tier: FeaturedTier
  category?: string
  limit: number
}): Promise<Agent[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  try {
    let query = supabase
      .from('agents')
      .select('*')
      .eq('featured_tier', opts.tier)
      .gt('featured_until', new Date().toISOString())
      .order('featured_until', { ascending: false })
      .limit(opts.limit)

    if (opts.category) {
      query = query.eq('category', opts.category)
    }

    const { data, error } = await query
    if (error || !data) return []
    return data as Agent[]
  } catch {
    return []
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
  if (filters.industries?.length) {
    results = results.filter((a) =>
      filters.industries!.some((i) => a.industry_tags.includes(i))
    )
  }
  if (filters.search) {
    const tokens = filters.search.toLowerCase().split(/\s+/).filter((t) => t.length > 1)
    results = results.filter((a) => {
      const haystack = `${a.name} ${a.tagline} ${a.description}`.toLowerCase()
      return tokens.every((token) => {
        const stems = [token, token.replace(/s$/, ''), token.replace(/ing$/, ''), token.replace(/ed$/, '')]
        return stems.some((s) => haystack.includes(s))
      })
    })
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

export async function getTasksForAgent(agentId: string): Promise<AgentTask[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  try {
    const { data, error } = await supabase
      .from('agent_tasks')
      .select('*')
      .eq('agent_id', agentId)
      .eq('available', true)
      .order('created_at', { ascending: false })
      .limit(4)

    if (error || !data) return []
    return data as AgentTask[]
  } catch {
    return []
  }
}
