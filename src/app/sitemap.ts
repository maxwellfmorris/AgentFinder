import type { MetadataRoute } from 'next'
import { getAgents } from '@/lib/agents'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bindie.ai'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agents = await getAgents()

  const agentPages = agents.map((agent) => ({
    url: `${BASE_URL}/agents/${agent.slug}`,
    lastModified: new Date(agent.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/agents`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...agentPages,
  ]
}
