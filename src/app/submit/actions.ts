'use server'

import { getSupabaseClient } from '@/lib/supabase'
import { CATEGORIES, PRICING_LABELS, COMPLEXITY_LABELS } from '@/types/database'
import type { PricingModel, SetupComplexity } from '@/types/database'

export interface SubmitResult {
  success: boolean
  error?: string
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function submitAgent(formData: FormData): Promise<SubmitResult> {
  const supabase = getSupabaseClient()
  if (!supabase) return { success: false, error: 'Database not configured.' }

  const name = (formData.get('name') as string)?.trim()
  const tagline = (formData.get('tagline') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const websiteRaw = (formData.get('website') as string)?.trim()
  const website = websiteRaw ? `https://${websiteRaw.replace(/^https?:\/\//i, '')}` : ''
  const logoRaw = (formData.get('logo_url') as string)?.trim()
  const logo_url = logoRaw ? `https://${logoRaw.replace(/^https?:\/\//i, '')}` : null
  const category = formData.get('category') as string
  const pricing_model = formData.get('pricing_model') as PricingModel
  const setup_complexity = formData.get('setup_complexity') as SetupComplexity
  const industry_tags = (formData.get('industry_tags') as string)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  const platform_integrations = (formData.get('platform_integrations') as string)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  if (!name || !tagline || !description || !category || !pricing_model || !setup_complexity) {
    return { success: false, error: 'Please fill in all required fields.' }
  }

  const slug = toSlug(name)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('agents') as any).insert({
    name,
    slug,
    tagline,
    description,
    website: website || null,
    logo_url,
    category,
    industry_tags,
    platform_integrations,
    pricing_model,
    setup_complexity,
    verified: false,
    average_rating: null,
    review_count: 0,
  })

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'An agent with this name already exists.' }
    }
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  return { success: true }
}
