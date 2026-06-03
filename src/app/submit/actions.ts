'use server'

import { getSupabaseClient } from '@/lib/supabase'
import { getSupabaseServer } from '@/lib/supabase-server'
import type { PricingModel, SetupComplexity } from '@/types/database'

// ── Smart import ──────────────────────────────────────────────────────────────

export type PrefillField = 'name' | 'tagline' | 'description' | 'website' | 'logo_url'

export type PrefillResult =
  | {
      ok: true
      fields: Partial<Record<PrefillField, string>>
      confidence: Partial<Record<PrefillField, 'high' | 'medium' | 'low'>>
      warnings: string[]
    }
  | { ok: false; error: string }

function isPrivateHost(hostname: string): boolean {
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '::1' ||
    !hostname.includes('.')
  ) return true
  if (
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('169.254.')
  ) return true
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) return true
  return false
}

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCharCode(parseInt(d, 10)))
    .trim()
}

function getMeta(html: string, attr: string, value: string): string | null {
  const pats = [
    new RegExp(`<meta[^>]+${attr}=["']${value}["'][^>]+content=["']([^"'<>]+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"'<>]+)["'][^>]+${attr}=["']${value}["']`, 'i'),
  ]
  for (const p of pats) {
    const m = html.match(p)
    if (m?.[1]) return decodeEntities(m[1])
  }
  return null
}

export async function prefillFromUrl(url: string): Promise<PrefillResult> {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return { ok: false, error: 'Please enter a valid URL.' }
  }

  if (parsed.protocol !== 'https:') {
    return { ok: false, error: 'URL must use https://.' }
  }

  if (isPrivateHost(parsed.hostname)) {
    return { ok: false, error: 'That URL points to a private or reserved address.' }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)
  let response: Response
  try {
    response = await fetch(parsed.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Bindie-Crawler/1.0 (+https://bindie.ai)',
        'Accept': 'text/html',
      },
    })
  } catch {
    clearTimeout(timer)
    return { ok: false, error: "That URL didn't return a webpage we could read." }
  }
  clearTimeout(timer)

  if (!response.ok || !response.headers.get('content-type')?.includes('html')) {
    return { ok: false, error: "That URL didn't return a webpage we could read." }
  }

  const html = (await response.text()).slice(0, 200 * 1024)
  const pageUrl = response.url

  const fields: Partial<Record<PrefillField, string>> = {}
  const confidence: Partial<Record<PrefillField, 'high' | 'medium' | 'low'>> = {}
  const warnings: string[] = []

  // name
  const ogTitle = getMeta(html, 'property', 'og:title')
  if (ogTitle) {
    fields.name = ogTitle
    confidence.name = 'high'
  } else {
    const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    if (m?.[1]) {
      fields.name = decodeEntities(m[1])
      confidence.name = 'medium'
      warnings.push('Used <title> because og:title was missing')
    }
  }

  // description
  const ogDesc = getMeta(html, 'property', 'og:description')
  if (ogDesc) {
    fields.description = ogDesc
    confidence.description = 'high'
  } else {
    const metaDesc = getMeta(html, 'name', 'description')
    if (metaDesc) {
      fields.description = metaDesc
      confidence.description = 'medium'
      warnings.push('Used meta description because og:description was missing')
    }
  }

  // logo_url
  const ogImage = getMeta(html, 'property', 'og:image')
  if (ogImage) {
    try {
      fields.logo_url = new URL(ogImage, pageUrl).toString()
      confidence.logo_url = 'high'
    } catch { /* skip invalid URLs */ }
  }

  // website — final URL after redirects
  fields.website = pageUrl
  confidence.website = 'high'

  // tagline — first sentence of description, fall back to og:title
  if (fields.description) {
    const parts = fields.description.split(/[.!?]\s+/)
    const hasSentenceBreak = parts.length > 1
    if (hasSentenceBreak && parts[0].length <= 100) {
      fields.tagline = parts[0]
      confidence.tagline = 'medium'
    } else if (fields.name) {
      fields.tagline = fields.name.slice(0, 100)
      confidence.tagline = 'medium'
      warnings.push(
        hasSentenceBreak
          ? 'Tagline derived from og:title because first sentence exceeded 100 characters'
          : 'Tagline derived from og:title because description had no sentence break'
      )
    }
  } else if (fields.name) {
    fields.tagline = fields.name.slice(0, 100)
    confidence.tagline = 'medium'
    warnings.push('Tagline derived from og:title because no description was found')
  }

  return { ok: true, fields, confidence, warnings }
}

// ── Submit ────────────────────────────────────────────────────────────────────

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
  const affiliateRaw = (formData.get('affiliate_url') as string)?.trim()
  const affiliate_url = affiliateRaw
    ? `https://${affiliateRaw.replace(/^https?:\/\//i, '')}`
    : null

  if (!name || !tagline || !description || !category || !pricing_model || !setup_complexity) {
    return { success: false, error: 'Please fill in all required fields.' }
  }

  const slug = toSlug(name)

  // Capture the submitter's user ID if they're signed in (null for anonymous)
  const serverClient = getSupabaseServer()
  const { data: { user } } = await serverClient.auth.getUser()
  const submitted_by_user_id = user?.id ?? null

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
    trust_tier: 'listed',
    status: 'pending',
    average_rating: null,
    review_count: 0,
    submitted_by_user_id,
    affiliate_url,
  })

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'An agent with this name already exists.' }
    }
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  return { success: true }
}
