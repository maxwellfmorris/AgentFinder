'use client'

import { AgentCard } from './AgentCard'
import { logClickEvent } from '@/lib/events'
import type { Agent } from '@/types/database'

interface SearchResultLinkProps {
  agent: Agent
  position: number
  query: string | null
}

export default function SearchResultLink({ agent, position, query }: SearchResultLinkProps) {
  const handleView = query
    ? () => {
        logClickEvent({ query, agentId: agent.id, position }).catch(() => {})
      }
    : undefined

  return <AgentCard agent={agent} onView={handleView} />
}
